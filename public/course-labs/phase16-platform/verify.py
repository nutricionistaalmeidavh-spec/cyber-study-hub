"""Verificação local integrada; não instala dependências nem cria cluster.
Uso: python3 verify.py [--firebase-jar /caminho/cloud-firestore-emulator.jar]
A opção Firebase exige npm ci prévio e Java; inicia apenas o JAR local em loopback.
Saída JSON contém comandos/exit/stdout/stderr, sem variáveis de ambiente.
"""
import argparse
import json
import os
from pathlib import Path
import platform
import shutil
import socket
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parent
checks = []

def run(name, folder, command, expected=0, env=None):
    result = subprocess.run(command, cwd=folder, env=env, capture_output=True, text=True, timeout=60)
    checks.append(dict(id=name, cwd=str(folder), command=command, expected_exit=expected,
                       exit_code=result.returncode, passed=result.returncode == expected,
                       stdout=result.stdout, stderr=result.stderr))
    if result.returncode != expected:
        raise AssertionError(name + ': saída inesperada')
    return result

def verify(jar):
    run('iam-matrix', ROOT/'iam', [sys.executable, '-m', 'unittest', '-v', 'test_iam.py'])
    run('iam-wide', ROOT/'iam', [sys.executable, 'evaluate.py', 'wide.json'])
    run('iam-fixed', ROOT/'iam', [sys.executable, 'evaluate.py', 'policy.json'])
    ci = ROOT/'ci'
    run('ci-safe', ci, ['node', 'pipeline.cjs'])
    run('ci-digest', ci, ['node', 'verify.cjs'])
    result = run('ci-unsafe', ci, ['node', 'pipeline.cjs', '--unsafe'], 1)
    assert 'gate: alice/b' in result.stderr and '200 !== 403' in result.stderr
    assert not (ci/'out-unsafe').exists(), 'artefato criado após gate vulnerável'
    artifact = ci/'out-safe/artifact.json'
    artifact.write_bytes(artifact.read_bytes() + b' ')
    try:
        result = run('ci-tamper', ci, ['node', 'verify.cjs'], 1)
        assert 'artefato alterado depois do gate' in result.stderr
    finally:
        run('ci-rebuild', ci, ['node', 'pipeline.cjs'])
    run('ci-retest', ci, ['node', 'verify.cjs'])
    run('electron-handler', ROOT/'electron', ['node', '--test', 'test.cjs'])
    with tempfile.TemporaryDirectory(prefix='course-ipc-mutation-') as tmp:
        copied = Path(tmp)
        for name in ('handler.cjs', 'test.cjs'):
            shutil.copy2(ROOT/'electron'/name, copied/name)
        handler = copied/'handler.cjs'
        before = handler.read_text()
        needle = "if (note.owner!==user) throw new Error('FORBIDDEN');"
        assert before.count(needle) == 1
        handler.write_text(before.replace(needle, '// mutação em cópia descartável'))
        result = run('electron-owner-mutation', copied, ['node', '--test', 'test.cjs'], 1)
        assert 'owner alheio negado' in result.stdout and 'fail 1' in result.stdout
    run('electron-retest', ROOT/'electron', ['node', '--test', 'test.cjs'])
    run('k8s-http-tcp', ROOT/'k8s', [sys.executable, '-m', 'unittest', '-v', 'test_server.py', 'test_check.py'])
    for name in ('setup.sh', 'run.sh', 'capstone.sh'):
        run('syntax-k8s-' + name, ROOT/'k8s', ['bash', '-n', name])
    run('syntax-rls', ROOT/'rls', ['bash', '-n', 'run.sh'])
    if jar:
        jar = Path(jar).resolve()
        assert jar.is_file(), 'JAR local ausente; este verificador não faz downloads'
        # Recusa reaproveitar um emulador desconhecido na porta fixa do teste.
        for port in (8088, 9150):
            with socket.socket() as probe:
                assert probe.connect_ex(('127.0.0.1', port)) != 0, ('porta ocupada', port)
        command = ['java', '-jar', str(jar), '--host', '127.0.0.1', '--port', '8088',
                   '--websocket_port', '9150', '--project_id', 'demo-course-platform',
                   '--rules', str(ROOT/'firebase/firestore.rules')]
        with tempfile.TemporaryFile(mode='w+') as log:
            server = subprocess.Popen(command, stdout=log, stderr=subprocess.STDOUT)
            try:
                ready = False
                for _ in range(100):
                    with socket.socket() as probe:
                        if probe.connect_ex(('127.0.0.1', 8088)) == 0:
                            ready = True
                            break
                    assert server.poll() is None, 'Emulador encerrou antes de escutar'
                    time.sleep(.1)
                assert ready, 'Emulador não abriu porta no prazo'
                env = os.environ.copy()
                env['FIRESTORE_EMULATOR_HOST'] = '127.0.0.1:8088'
                run('firestore-rules-runtime', ROOT/'firebase', ['node', 'test.mjs'], env=env)
                checks[-1]['emulator_command'] = command
                checks[-1]['emulator_host'] = env['FIRESTORE_EMULATOR_HOST']
            finally:
                server.terminate()
                try:
                    server.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    server.kill(); server.wait()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--firebase-jar')
    args = parser.parse_args()
    failure = None
    try:
        verify(args.firebase_jar)
    except Exception as error:
        failure = str(error)
    print(json.dumps(dict(python=platform.python_version(), checks=checks, failure=failure),
                     ensure_ascii=False, indent=2))
    raise SystemExit(1 if failure else 0)

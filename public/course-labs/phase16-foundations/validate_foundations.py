"""Executa os labs locais e grava evidência; não certifica Windows/VM/Wireshark.
Uso: python3 validate_foundations.py [--disable-leaks]
--disable-leaks só é necessário quando LeakSanitizer não pode inspecionar /proc.
"""
from pathlib import Path
import argparse, hashlib, importlib.util, json, os, platform, subprocess, sys, tempfile
from datetime import datetime, timezone
from http.client import HTTPConnection
from http.server import HTTPServer
from threading import Thread

LAB=Path(__file__).resolve().parent
parser=argparse.ArgumentParser()
parser.add_argument('--disable-leaks',action='store_true')
args=parser.parse_args()
results=[]

def run(label,command,expected=0,contains=(),excludes=(),env=None):
    try:
        p=subprocess.run(command,cwd=LAB,env=env,text=True,capture_output=True,timeout=60)
        passed=(p.returncode==expected if expected is not None else p.returncode!=0)
        passed=passed and all(s in p.stdout+p.stderr for s in contains) and all(s not in p.stdout+p.stderr for s in excludes)
        row=dict(check=label,command=command,exit_code=p.returncode,passed=passed,stdout=p.stdout,stderr=p.stderr)
    except (OSError, subprocess.TimeoutExpired) as error:
        row=dict(check=label,command=command,exit_code=None,passed=False,error=str(error))
    results.append(row)
    print(label, 'PASS' if row['passed'] else 'FAIL',flush=True)
    return row['passed']

def check(label, fn):
    try:
        detail=fn()
        row=dict(check=label,passed=True,detail=detail)
    except Exception as error:
        row=dict(check=label,passed=False,error=repr(error))
    results.append(row)
    print(label, 'PASS' if row['passed'] else 'FAIL',flush=True)

def module(name):
    spec=importlib.util.spec_from_file_location('fixture_'+name.replace('-','_'),LAB/(name+'.py'))
    m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

with tempfile.TemporaryDirectory(prefix='foundations-check-') as tmp:
    temp=Path(tmp)
    for u,expected in [('PY-01','Olá, Ana: 3 itens\nFim'),('PY-04','subtotal=750'),('PY-06','registros=2'),('PY-07','TypeError propagado')]:
        run(u,[sys.executable,str(LAB/(u+'.py'))],contains=[expected])
    zero=temp/'zero.py';zero.write_text((LAB/'PY-01.py').read_text().replace('quantidade = 3','quantidade = 0'))
    run('PY-01 zero',[sys.executable,str(zero)],contains=['Fim'],excludes=['Olá'])
    malformed=temp/'indentacao.py';malformed.write_text((LAB/'PY-01.py').read_text().replace('    print(f','print(f'))
    run('PY-01 indentacao invalida',[sys.executable,str(malformed)],expected=None,contains=['IndentationError'])
    def python_contracts():
        m=module('PY-04')
        assert m.subtotal(125,4)==500
        assert m.subtotal(0,9)==0
        for values,error in [((2.5,3),TypeError),((2,-1),ValueError),((2,False),TypeError)]:
            try: m.subtotal(*values)
            except error: pass
            else: raise AssertionError(values)
        files=module('PY-06')
        source=temp/'invalid-utf8';dest=temp/'preservado.txt'
        source.write_bytes(b'\xff');dest.write_text('antes')
        try:files.resumir(source,dest)
        except UnicodeDecodeError:pass
        else:raise AssertionError('UTF-8 inválido aceito')
        assert dest.read_text()=='antes'
        return 'subtotal: 500, zero e três contratos rejeitados; UTF-8 inválido preserva destino'
    check('PY contratos adicionais',python_contracts)
    venv=temp/'venv'
    if run('PY-08 criar venv',[sys.executable,'-m','venv',str(venv)]):
        python=str(venv/('Scripts/python.exe' if os.name=='nt' else 'bin/python'))
        if run('PY-08 instalar offline',[python,'-m','pip','install','--no-index','--find-links',str(LAB),'-r',str(LAB/'requirements-PY-08.txt')]):
            run('PY-08 imports e versao',[python,str(LAB/'PY-08.py')],contains=['2.0 KiB','1.0.0',str(venv)])
    # Ambiente novo sem instalar a distribuição, não depende do Python global do usuário.
    absent=temp/'sem-dependencia'
    if run('PY-08 venv sem dependencia',[sys.executable,'-m','venv','--without-pip',str(absent)]):
        python=str(absent/('Scripts/python.exe' if os.name=='nt' else 'bin/python'))
        run('PY-08 dependencia ausente',[python,str(LAB/'PY-08.py')],expected=None,contains=['ModuleNotFoundError', 'medidas_lab'])
    env=dict(os.environ)
    if args.disable_leaks:env['ASAN_OPTIONS']='detect_leaks=0'
    for u,marker in [('C-01','itens=12'),('C-06','n=3 soma=13 vazio=0'),('C-07','4 caracteres aceitos; 5 recusados; destino preservado'),('C-09','x=8 alias=8 null=recusado'),('C-12','falha simulada e tamanho zero tratados'),('C-13','nenhum acesso depois de free'),('C-19','ultimo=9')]:
        exe=str(temp/u)
        flags=['-fsanitize=address','-fno-omit-frame-pointer'] if u=='C-13' else (['-fsanitize=address,undefined','-fno-sanitize-recover=all','-fno-omit-frame-pointer'] if u=='C-19' else ['-Wpedantic'])
        if not run(u+' compile',['cc','-std=c11','-Wall','-Wextra','-g','-O0',*flags,str(LAB/(u+'.c')),'-o',exe]):continue
        run(u+' valido',[exe]+(['corrigido'] if u=='C-19' else []),contains=[marker],env=env)
        if u=='C-13':run('C-13 UAF detectado',[exe,'falha'],expected=None,contains=['heap-use-after-free'],env=env)
        if u=='C-19':
            run('C-19 OOB detectado',[exe,'asan'],expected=None,contains=['heap-buffer-overflow'],env=env)
            run('C-19 overflow detectado',[exe,'ubsan'],expected=None,contains=['signed integer overflow'],env=env)
    run('JS-07 seis cenarios',['node','JS-07.mjs'],contains=['/ok','/ausente','/quebrado','/lento','/redireciona','/offline'])
    run('TLS real e negativos',[sys.executable,'tls_local.py'],contains=['TLSv1.2','TLSv1.3','CA-nao-confiavel','hostname-incorreto','rejeitado'])
    run('LAB-01 gate e contador real',[sys.executable,'LAB-01-scope.py'],contains=['"requests_recebidas": 1'])
    def canary():
        m=module('LAB-03-canary')
        server=HTTPServer(('127.0.0.1',0),m.Handler)
        t=Thread(target=server.serve_forever,daemon=True);t.start()
        observed=[]
        try:
            for path,status,body in [('/canary',200,b'CSH-LAB03\n'),('/ausente',404,b'not found\n')]:
                c=HTTPConnection('127.0.0.1',server.server_port,timeout=2)
                try:
                    c.request('GET',path);r=c.getresponse();assert r.status==status;assert r.read()==body
                    observed.append([path,status])
                finally:c.close()
        finally:server.shutdown();server.server_close();t.join(3)
        assert not t.is_alive()
        return dict(observed=observed,limite='HTTP loopback real; rede de duas VMs não executada')
    check('LAB-03 canary HTTP',canary)
    run('LAB-03 bind amplo recusado',[sys.executable,'LAB-03-canary.py','--bind','0.0.0.0'],expected=None,contains=['use somente loopback'])

hashes={str(p.relative_to(LAB)):hashlib.sha256(p.read_bytes()).hexdigest() for p in LAB.rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.name not in ['validation-results.json']}
report=dict(utc=datetime.now(timezone.utc).isoformat(),python=sys.version,platform=platform.platform(),disable_leaks=args.disable_leaks,
            checks=results,passed=sum(bool(r['passed']) for r in results),total=len(results),source_sha256=hashes,
            limitations=['Windows/PowerShell/VirtualBox não executados','Wireshark/descriptografia e captura raw não executados','LeakSanitizer não verificado quando disable_leaks=true'])
(LAB/'validation-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f"{report['passed']}/{report['total']} checks confirmados")
sys.exit(0 if report['passed']==report['total'] else 1)

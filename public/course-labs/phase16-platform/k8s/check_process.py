"""Executar dentro do container notes; falhas de kubectl NÃO contam como defesa."""
import errno
import os
from pathlib import Path

assert os.getuid() == 10001 and os.getgid() == 10001
status = dict(line.split(':', 1) for line in Path('/proc/1/status').read_text().splitlines())
for key, value in [('CapEff', '0000000000000000'), ('NoNewPrivs', '1'), ('Seccomp', '2')]:
    assert status[key].strip() == value, (key, status[key])
assert not Path('/var/run/secrets/kubernetes.io/serviceaccount/token').exists()
# /app pertence ao UID 10001 na imagem; EACCES não demonstra readonly.
try:
    with open('/app/rootfs-proof', 'w') as stream:
        stream.write('fixture')
except OSError as error:
    assert error.errno == errno.EROFS, ('esperado EROFS; investigar outra causa', error)
else:
    Path('/app/rootfs-proof').unlink()
    raise AssertionError('rootfs gravável')
proof = Path('/tmp/course-volume-proof')
proof.write_text('ok')
assert proof.read_text() == 'ok'
proof.unlink()
print('PASS UID/GID=10001 CapEff=0 NoNewPrivs=1 Seccomp=2 token-SA=ausente EROFS /tmp=gravável')

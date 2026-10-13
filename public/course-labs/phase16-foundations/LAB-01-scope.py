"""Contrato de escopo didático + HTTP real exclusivamente em 127.0.0.1.
A política de exemplo não constitui autorização de ativos de terceiros.
"""
from datetime import datetime, timedelta, timezone
from http.client import HTTPConnection
from http.server import BaseHTTPRequestHandler, HTTPServer
from threading import Thread
from urllib.parse import urlsplit
import json


def autorizar(policy, method, url, now, halted=False):
    if not policy.get('owner') or not policy.get('approval_id'):
        return 'sem-autorizacao'
    if halted:
        return 'parada'
    if not policy['start'] <= now < policy['end']:
        return 'fora-da-janela'
    try:
        target = urlsplit(url)
        port = target.port
    except ValueError:
        return 'URL-invalida'
    if (target.scheme != 'http' or target.hostname != '127.0.0.1'
            or target.username is not None or target.password is not None
            or port != policy['port'] or target.query or target.fragment):
        return 'ativo-fora-do-escopo'
    if method != 'GET' or target.path != '/health':
        return 'acao-fora-do-escopo'
    return 'permitido'


def demo():
    received = []
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            received.append(self.path)
            body = b'{"status":"lab-ok"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        def log_message(self, *_): pass
    server = HTTPServer(('127.0.0.1', 0), Handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    now = datetime.now(timezone.utc)
    port = server.server_port
    policy = dict(owner='aluno-dono-deste-processo', approval_id='LAB-01-local',
                  port=port, start=now, end=now+timedelta(minutes=5))
    base = f'http://127.0.0.1:{port}'
    cases = [
        ('permitido', policy, 'GET', base+'/health', now, False),
        ('acao-fora-do-escopo', policy, 'POST', base+'/health', now, False),
        ('acao-fora-do-escopo', policy, 'GET', base+'/admin', now, False),
        ('ativo-fora-do-escopo', policy, 'GET', 'http://192.0.2.10:80/health', now, False),
        ('ativo-fora-do-escopo', policy, 'GET', base+'/health?export=1', now, False),
        ('fora-da-janela', policy, 'GET', base+'/health', policy['end'], False),
        ('parada', policy, 'GET', base+'/health', now, True),
        ('sem-autorizacao', dict(policy,approval_id=''), 'GET', base+'/health', now, False),
    ]
    results = []
    try:
        for expected, current, method, url, moment, halted in cases:
            decision = autorizar(current, method, url, moment, halted)
            assert decision == expected, (decision, expected)
            if decision == 'permitido':
                # Sem DNS e sem seguir redirects; só o listener recém-criado.
                conn = HTTPConnection('127.0.0.1', port, timeout=2)
                try:
                    conn.request('GET', '/health')
                    response = conn.getresponse()
                    assert response.status == 200
                    assert json.loads(response.read()) == {'status':'lab-ok'}
                finally:
                    conn.close()
            results.append({'caso':url, 'metodo':method, 'decisao':decision})
        assert received == ['/health'], received
        print(json.dumps({'resultados':results,'requests_recebidas':len(received)},indent=2))
    finally:
        server.shutdown(); server.server_close(); thread.join(timeout=3)
    assert not thread.is_alive()

if __name__ == '__main__': demo()

"""Servidor benigno: responde só a /canary, não publica diretórios/arquivos."""
from http.server import BaseHTTPRequestHandler, HTTPServer
import argparse
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        ok = self.path == '/canary'
        body = b'CSH-LAB03\n' if ok else b'not found\n'
        self.send_response(200 if ok else 404)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers(); self.wfile.write(body)
if __name__ == '__main__':
    p = argparse.ArgumentParser(); p.add_argument('--bind',default='127.0.0.1')
    p.add_argument('--port',type=int,default=8080); args = p.parse_args()
    if args.bind not in ('127.0.0.1','192.168.77.10'):
        p.error('use somente loopback ou o endereço da VM interna deste lab')
    if not 1024 <= args.port <= 65535: p.error('porta deve estar entre 1024 e 65535')
    with HTTPServer((args.bind,args.port),Handler) as server:
        print(f'canary em {args.bind}:{args.port}',flush=True)
        try: server.serve_forever()
        except KeyboardInterrupt: pass

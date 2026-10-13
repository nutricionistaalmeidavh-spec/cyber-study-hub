"""App de notas sintéticas; sem banco, sem shell, sem credenciais externas."""
import hmac,json,os
from pathlib import Path
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer

def handler(token):
 class Notes(BaseHTTPRequestHandler):
  def do_GET(self):
   if self.path=='/health': status,body=200,{'status':'ok'}
   elif self.path!='/note': status,body=404,{'error':'not found'}
   elif not hmac.compare_digest(self.headers.get('Authorization',''),'Bearer '+token): status,body=401,{'error':'unauthorized'}
   else: status,body=200,{'note':'somente dados sintéticos'}
   wire=(json.dumps(body,ensure_ascii=False)+'\n').encode()
   self.send_response(status);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(wire)));self.end_headers();self.wfile.write(wire)
  def log_message(self,format,*args):
   # Não registra Authorization; path/status são suficientes para este exercício.
   print(json.dumps({'peer':self.client_address[0],'event':format%args}),flush=True)
 return Notes
if __name__=='__main__':
 token=Path(os.environ.get('TOKEN_FILE','/run/secrets/token')).read_text().strip()
 ThreadingHTTPServer(('0.0.0.0',8080),handler(token)).serve_forever()

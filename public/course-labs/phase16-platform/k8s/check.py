"""Executado DENTRO do cliente: distingue HTTP negado de bloqueio de conexão."""
import errno, socket, sys, urllib.request, urllib.error
mode=sys.argv[1]
if mode not in ('allow','unauth','deny-selector','deny-policy'):
 raise SystemExit('modo: allow | unauth | deny-selector | deny-policy')
req=urllib.request.Request(sys.argv[2] if len(sys.argv)>2 else 'http://notes:8000/note')
if mode!='unauth': req.add_header('Authorization','Bearer fixture-only-platform-token')
try:
 with urllib.request.urlopen(req,timeout=4) as r:
  body=r.read().decode();assert mode=='allow',(mode,r.status)
  assert r.status==200 and 'sintéticos' in body
  print('PASS HTTP 200 nota sintética')
except urllib.error.HTTPError as e:
 assert mode=='unauth' and e.code==401,(mode,e)
 print('PASS HTTP 401: rede alcança app, autenticação negada')
except (urllib.error.URLError,TimeoutError) as e:
 reason=e.reason if isinstance(e,urllib.error.URLError) else e
 # DNS quebrado não é prova de NetworkPolicy nem de selector vazio.
 if isinstance(reason,socket.gaierror): raise
 timeout=isinstance(reason,TimeoutError) or getattr(reason,'errno',None)==errno.ETIMEDOUT
 refused=isinstance(reason,ConnectionRefusedError) or getattr(reason,'errno',None)==errno.ECONNREFUSED
 assert (mode=='deny-selector' and (timeout or refused)) or (mode=='deny-policy' and timeout),(mode,e)
 print('PASS '+mode+': '+type(reason).__name__+'; correlacionar endpoints/CNI e retestar allow')

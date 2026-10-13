import threading, unittest, urllib.request, urllib.error, json
from http.server import ThreadingHTTPServer
from server import handler
class HTTPTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.server=ThreadingHTTPServer(('127.0.0.1',0),handler('fixture-only-platform-token'))
  cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start()
  cls.base='http://127.0.0.1:'+str(cls.server.server_port)
 @classmethod
 def tearDownClass(cls): cls.server.shutdown();cls.server.server_close();cls.thread.join()
 def request(self,path,token=None):
  r=urllib.request.Request(self.base+path)
  if token:r.add_header('Authorization','Bearer '+token)
  try:
   with urllib.request.urlopen(r,timeout=2) as out:return out.status,json.load(out)
  except urllib.error.HTTPError as e:return e.code,json.load(e)
 def test_readiness(self): self.assertEqual(self.request('/health'),(200,{'status':'ok'}))
 def test_auth_and_retest(self):
  for _ in range(2):
   self.assertEqual(self.request('/note','fixture-only-platform-token'),(200,{'note':'somente dados sintéticos'}))
   self.assertEqual(self.request('/note')[0],401)
   self.assertEqual(self.request('/note','wrong')[0],401)
 def test_missing(self): self.assertEqual(self.request('/absent')[0],404)
if __name__=='__main__':unittest.main(verbosity=2)

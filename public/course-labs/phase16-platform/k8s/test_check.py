"""Contrato do cliente por HTTP/TCP reais; não executa Kubernetes ou CNI."""
import socket
import subprocess
import sys
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from server import handler

class ClientTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), handler('fixture-only-platform-token'))
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = 'http://127.0.0.1:' + str(cls.server.server_port)

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown(); cls.server.server_close(); cls.thread.join()

    def invoke(self, mode, url):
        return subprocess.run([sys.executable, str(Path(__file__).with_name('check.py')), mode, url],
                              capture_output=True, text=True, timeout=8)

    def test_http_contract(self):
        for mode in ('allow', 'unauth'):
            with self.subTest(mode=mode):
                result = self.invoke(mode, self.base + '/note')
                self.assertEqual(result.returncode, 0, result.stderr)

    def test_http_not_accepted_as_network_denial(self):
        for mode in ('deny-selector', 'deny-policy'):
            for route in ('/note', '/absent'):
                with self.subTest(mode=mode, route=route):
                    self.assertNotEqual(self.invoke(mode, self.base + route).returncode, 0)

    def test_refusal_is_not_policy_timeout(self):
        # Porta alocada mas não escutando: TCP recusa; preservamos o socket até terminar.
        with socket.socket() as reserved:
            reserved.bind(('127.0.0.1', 0))
            url = 'http://127.0.0.1:' + str(reserved.getsockname()[1]) + '/note'
            self.assertEqual(self.invoke('deny-selector', url).returncode, 0)
            self.assertNotEqual(self.invoke('deny-policy', url).returncode, 0)

if __name__ == '__main__': unittest.main(verbosity=2)

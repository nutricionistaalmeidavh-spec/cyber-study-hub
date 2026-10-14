import importlib.util, subprocess, tempfile, pathlib, unittest, json, struct
HERE=pathlib.Path(__file__).resolve().parent

def mod(n):
    spec=importlib.util.spec_from_file_location(n,HERE/(n+'.py'))
    m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

class LabTests(unittest.TestCase):
    def test_network_loopback(self):
        result=mod('network_lab').run()
        self.assertEqual((result['tcp_reply'],result['udp_reply'],result['bind']),('PONG','ACK','127.0.0.1'))
        self.assertTrue(0<result['tcp_port']<=65535)
    def test_permissions_tempdir(self):
        r=mod('permissions_lab').run();self.assertEqual(r['directory'],'0o700');self.assertEqual(r['file'],'0o600')
    def test_scan_only_local(self):
        x=mod('scan_lab').run();self.assertTrue(x['connected']);self.assertTrue(x['refused']);self.assertEqual(x['scope'],'127.0.0.1 only')
    def test_capture_valid_header_and_frame(self):
        m=mod('make_capture')
        with tempfile.TemporaryDirectory() as td:
            path=pathlib.Path(td)/'test.pcap'; r=m.create(path);raw=path.read_bytes()
            self.assertEqual(raw[:4],b'\xd4\xc3\xb2\xa1'); self.assertEqual(r['frames'],1)
            n=struct.unpack('<I',raw[32:36])[0];self.assertEqual(n,r['bytes'])
            self.assertIn(b'GET /demo HTTP/1.1',raw)
            self.assertEqual(m.checksum(m.frame()[14:34]),0)
    def test_triage_never_equates_string_to_malware(self):
        r=mod('triage').run();self.assertIn('ransomware',r['markers']);self.assertEqual(r['classification'],'UNDETERMINED');self.assertFalse(r['executed']);self.assertEqual(len(r['sha256']),64)
    def test_ics_normal_divergent_missing_single_spike(self):
        m=mod('ics_lab');self.assertEqual(m.evaluate([{'hmi':1000,'sensors':[1000,999]},{'hmi':1000,'sensors':[1002,999]}]),'OK')
        self.assertEqual(m.evaluate([{'hmi':1000,'sensors':[1250,1248]},{'hmi':1000,'sensors':[1249,1251]}]),'INVESTIGATE')
        self.assertEqual(m.evaluate([{'hmi':None,'sensors':[]}]),'INSUFFICIENT')
        self.assertEqual(m.evaluate([{'hmi':1000,'sensors':[1250,1250]},{'hmi':1000,'sensors':[999,1000]}]),'OK')
    def test_compiled_c_cases(self):
        import shutil
        if shutil.which('cc') is None:self.skipTest('cc unavailable; no false execution claim')
        outputs={'compiled.c':'10,-4','bounds.c':'0:OK\n7:OK\n8:REJECT','flags.c':'NEG,ZERO,POS','reverse.c':'REVER,APROVADO'}
        with tempfile.TemporaryDirectory() as td:
            for f,expected in outputs.items():
                dest=str(pathlib.Path(td)/f.replace('.c',''))
                cp=subprocess.run(['cc','-std=c11','-Wall','-Wextra','-O0',str(HERE/f),'-o',dest],capture_output=True,text=True)
                self.assertEqual(cp.returncode,0,msg=f+':'+cp.stderr)
                run=subprocess.run([dest],capture_output=True,text=True,timeout=4)
                self.assertEqual(run.returncode,0,msg=f+':'+run.stderr)
                self.assertEqual(run.stdout.strip(),expected)

if __name__=='__main__':unittest.main()

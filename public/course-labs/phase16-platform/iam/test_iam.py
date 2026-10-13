import json, unittest
from pathlib import Path
from evaluate import evaluate
D=Path(__file__).parent
class PolicyTests(unittest.TestCase):
    def test_matriz_antes_depois_e_reteste(self):
        wide=json.loads((D/'wide.json').read_text()); fixed=json.loads((D/'policy.json').read_text())
        for action,key,tls,want in [('s3:GetObject','reports/a.txt',True,'allowed'),('s3:GetObject','private/a.txt',True,'implicitDeny'),('s3:PutObject','reports/a.txt',True,'implicitDeny'),('s3:GetObject','reports/a.txt',False,'explicitDeny')]:
            arn='arn:aws:s3:::course-iam-lab/'+key
            with self.subTest(action=action,key=key,tls=tls):
                self.assertEqual(evaluate(wide,action,arn,tls),'allowed')
                self.assertEqual(evaluate(fixed,action,arn,tls),want)
                self.assertEqual(evaluate(fixed,action,arn,tls),want)
    def test_listbucket_nao_e_getobject(self):
        p=json.loads((D/'policy.json').read_text())
        self.assertEqual(evaluate(p,'s3:ListBucket','arn:aws:s3:::course-iam-lab',True),'implicitDeny')
    def test_condicao_ausente_nao_corresponde_false(self):
        p=json.loads((D/'policy.json').read_text())
        self.assertEqual(evaluate(p,'s3:GetObject','arn:aws:s3:::course-iam-lab/reports/a.txt',None),'allowed')
    def test_operador_nao_implementado_falha(self):
        p=json.loads((D/'policy.json').read_text());p['Statement'][0]['NotAction']='s3:DeleteObject'
        with self.assertRaises(ValueError): evaluate(p,'s3:GetObject','x',True)
if __name__=='__main__': unittest.main(verbosity=2)

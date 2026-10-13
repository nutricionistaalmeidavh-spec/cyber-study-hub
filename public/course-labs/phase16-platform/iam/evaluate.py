"""Emulador DIDÁTICO, não é o AWS IAM Policy Simulator.
Apenas identity policy, glob *, ações S3 e Bool SecureTransport.
Sem SCP, boundary, trust, resource policy, sessão, NotAction ou variáveis.
Campos/operadores fora do subconjunto falham explicitamente.
"""
import json, re, sys
from pathlib import Path

def many(x):
    return x if isinstance(x, list) else [x]

def matches(pattern, value):
    # Apenas *; fnmatch também aceitaria [] e ?, não implementados aqui.
    return re.fullmatch(re.escape(pattern).replace(r'\*', '.*'), value) is not None

def evaluate(policy, action, resource, tls):
    if set(policy) != {'Version','Statement'} or policy['Version'] != '2012-10-17':
        raise ValueError('policy fora do subconjunto')
    allows = False
    denies = False
    for st in policy['Statement']:
        if set(st)-{'Sid','Effect','Action','Resource','Condition'}:
            raise ValueError('elemento não suportado')
        if st['Effect'] not in ('Allow','Deny'):
            raise ValueError('Effect inválido')
        cond=st.get('Condition')
        if cond is not None and cond not in ({'Bool':{'aws:SecureTransport':'false'}},{'Bool':{'aws:SecureTransport':'true'}}):
            raise ValueError('Condition não suportada')
        applies = any(matches(a.lower(),action.lower()) for a in many(st['Action']))
        applies = applies and any(matches(r,resource) for r in many(st['Resource']))
        if cond:
            # Chave ausente NÃO equivale a false: este Bool não encontra correspondência.
            applies = applies and tls is not None and tls == (cond['Bool']['aws:SecureTransport']=='true')
        if applies:
            allows |= st['Effect']=='Allow'
            denies |= st['Effect']=='Deny'
    return 'explicitDeny' if denies else 'allowed' if allows else 'implicitDeny'

if __name__ == '__main__':
    p=json.loads(Path(sys.argv[1]).read_text())
    rows=[('read-report','s3:GetObject','reports/a.txt',True),
          ('read-private','s3:GetObject','private/a.txt',True),
          ('write-report','s3:PutObject','reports/a.txt',True),
          ('plaintext','s3:GetObject','reports/a.txt',False)]
    for name,action,key,tls in rows:
        print(name,evaluate(p,action,'arn:aws:s3:::course-iam-lab/'+key,tls))

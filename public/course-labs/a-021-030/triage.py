"""Triagem puramente estática de texto fictício. Jamais interpreta IOC como malware confirmado."""
import hashlib
SAMPLE=b'Relatorio de treinamento: o termo ransomware aparece apenas como documentacao.\n'
def run(data=SAMPLE):
    if not isinstance(data,bytes): raise TypeError('Amostra precisa ser bytes')
    markers=[x for x in (b'ransomware',b'cmd.exe',b'powershell') if x in data.lower()]
    return {'sha256':hashlib.sha256(data).hexdigest(), 'markers':[x.decode() for x in markers], 'classification':'UNDETERMINED','executed':False}
if __name__=='__main__':print(run())

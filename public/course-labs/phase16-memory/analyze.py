"""Medições reais de bytes; eventos do caso 160 são sintéticos identificados."""
from collections import Counter
from pathlib import Path
import argparse, hashlib, json, math
ROOT = Path(__file__).resolve().parent

def entropy(data):
    if not data: return 0.0
    return -sum((n/len(data))*math.log2(n/len(data)) for n in Counter(data).values())

def measure():
    result = {}
    for name in ['entropy-zero.bin','entropy-uniform.bin','text.bin','compressed.bin','random.bin','mixed.bin']:
        data = (ROOT/'fixtures'/name).read_bytes()
        result[name] = {'bytes':len(data), 'H':round(entropy(data),4),
            'windows1024':[round(entropy(data[i:i+1024]),4) for i in range(0,len(data),1024)]}
    assert result['entropy-zero.bin']['H'] == 0
    assert result['entropy-uniform.bin']['H'] == 8
    return result

def investigate(events_path=None):
    folder = ROOT/'fixtures'
    sample = (folder/'sample.txt').read_bytes()
    expected = json.loads((folder/'manifest.json').read_text())['sample.txt']
    assert hashlib.sha256(sample).hexdigest() == expected, 'sample hash mismatch'
    events = [json.loads(x) for x in (Path(events_path) if events_path else folder/'events.jsonl').read_text().splitlines()]
    # Correlação exige MESMO PID, arquivo com hash e DNS posterior em 10s.
    from datetime import datetime
    files = {e['pid']:e for e in events if e['event']=='file' and e['sha256']==expected}
    hits = []
    for e in events:
        if e['event'] != 'dns' or e['query'] != 'training.invalid' or e['pid'] not in files: continue
        dt = (datetime.fromisoformat(e['time'])-datetime.fromisoformat(files[e['pid']]['time'])).total_seconds()
        if 0 <= dt <= 10: hits.append(e['pid'])
    signature = lambda b: b'CSH-INERT-160' in b and b'training.invalid' in b
    assert signature(sample) and not signature((folder/'benign.txt').read_bytes())
    # O experimento devolve também hits=[]; o runner verifica o gabarito de cada fixture.
    return {'synthetic':True,'sha256':expected,'correlated_pids':hits,
            'excluded_dns_pid':900,'timeline':events,'signature_positive':True,'signature_negative':False}

def rop(shadow=False):
    # Interpretador simbólico: nomes de operações, sem bytes/instruções/endereço nativo.
    stack = ['LOAD_2','ADD_3','STOP']; expected = ['STOP']; pc=0; value=0; trace=[]
    while pc < len(stack):
        operation=stack[pc]
        if shadow and (pc >= len(expected) or operation != expected[pc]):
            return {'blocked':True,'reason':'symbolic return mismatch','trace':trace}
        if operation == 'LOAD_2': value=2
        elif operation == 'ADD_3': value+=3
        elif operation == 'STOP': break
        trace.append({'slot':pc,'operation':operation,'value':value}); pc+=1
    return {'blocked':False,'result':value,'trace':trace}

if __name__ == '__main__':
    p=argparse.ArgumentParser(); p.add_argument('mode', choices=['entropy','investigate','rop'])
    p.add_argument('--events', type=Path, help='cópia local de events.jsonl para o experimento investigate')
    args=p.parse_args()
    if args.events and args.mode != 'investigate': p.error('--events exige investigate')
    result = measure() if args.mode=='entropy' else investigate(args.events) if args.mode=='investigate' else {'plain':rop(),'shadow':rop(True)}
    print(json.dumps(result,indent=2))

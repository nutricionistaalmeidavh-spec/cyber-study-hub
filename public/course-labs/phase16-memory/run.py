"""Build/test com expectativas explícitas. Só processos locais; sem rede.
Uso: python3 run.py build|parser|types|stack|heap|maps|canary|fuzz|triage|variants|all
"""
from pathlib import Path
import argparse, hashlib, json, os, platform, resource, shutil, subprocess, sys, tempfile
ROOT=Path(__file__).resolve().parent
BUILD=ROOT/'build'
LOG=BUILD/'logs'
RESULT=[]

def limited():
    resource.setrlimit(resource.RLIMIT_CORE,(0,0))
    resource.setrlimit(resource.RLIMIT_STACK,(8*1024*1024,8*1024*1024))

def run(args, *, expect=0, contains=None, tag=None):
    env=dict(os.environ, ASAN_OPTIONS='detect_leaks=0:abort_on_error=1', UBSAN_OPTIONS='halt_on_error=1:print_stacktrace=1')
    p=subprocess.run([str(x) for x in args],cwd=ROOT,capture_output=True,text=True,timeout=20,env=env,preexec_fn=limited)
    output=p.stdout+p.stderr
    name=tag or Path(str(args[0])).name
    LOG.mkdir(parents=True,exist_ok=True)
    (LOG/(name+'.txt')).write_text('$ '+' '.join(map(str,args))+'\n'+output+f'\nexit={p.returncode}\n')
    good=(p.returncode != 0) if expect=='failure' else p.returncode==expect
    if contains: good=good and contains in output
    RESULT.append({'tag':name,'command':list(map(str,args)),'exit':p.returncode,'expected':expect,'required_text':contains,'pass':good})
    if not good: raise AssertionError(f'{name}: exit={p.returncode}; expected={expect}, required={contains}\n{output}')
    return output

def build():
    BUILD.mkdir(exist_ok=True)
    run([sys.executable,'make_fixtures.py'],tag='fixtures')
    cc=os.environ.get('CC','cc')
    base=[cc,'-std=c11','-g','-O0','-Wall','-Wextra','-fno-omit-frame-pointer']
    # Non-PIE nos sanitizers reduz colisões de shadow memory; não é build de entrega.
    for name,src,flags in [
        ('parser-v1',['parser.c','driver.c'],['-fsanitize=address','-fno-pie','-no-pie']),
        ('parser-v2',['parser.c','driver.c'],['-DFIXED','-fsanitize=address,undefined','-fno-pie','-no-pie']),
        ('lab-asan',['lab.c'],['-fsanitize=address','-fno-pie','-no-pie']),
        ('lab-ubsan',['lab.c'],['-fsanitize=undefined','-fno-sanitize-recover=all']),
        ('lab-canary',['lab.c'],['-fstack-protector-all','-fno-pie','-no-pie']),
        ('lab-plain',['lab.c'],['-fno-stack-protector','-fno-pie','-no-pie']),
        ('maps-pie',['maps.c'],['-fPIE','-pie','-fstack-protector-strong','-Wl,-z,relro,-z,now,-z,noexecstack']),
        ('maps-exec',['maps.c'],['-fno-pie','-no-pie','-Wl,-z,noexecstack']),
        ('fuzz-fixed',['parser.c','fuzz_harness.c','fuzz_driver.c'],['-DFIXED','-fsanitize=address,undefined','-fno-pie','-no-pie']),
        ('variants',['variants.c'],['-fsanitize=address,undefined','-fno-pie','-no-pie'])]:
        run(base+src+flags+['-o',str(BUILD/name)],tag='build-'+name)
    (BUILD/'environment.json').write_text(json.dumps({'platform':platform.platform(),'python':sys.version,
        'compiler':run([cc,'--version'],tag='compiler').splitlines()[0],
        'clang_available':bool(shutil.which('clang')),'gdb_available':bool(shutil.which('gdb'))},indent=2))

def parser():
    for version in ['v1','v2']:
        for name,n in [('valid',3),('zero',0),('boundary7',7)]:
            run([BUILD/f'parser-{version}',f'fixtures/{name}.bin'],contains=f'result={n} ',tag=version+'-'+name)
    for name in ['overflow8','overflow8b']:
        run([BUILD/'parser-v1',f'fixtures/{name}.bin'],expect='failure',contains='stack-buffer-overflow',tag='v1-'+name)
    run([BUILD/'parser-v1','fixtures/read-oob.bin'],expect='failure',contains='heap-buffer-overflow',tag='v1-read-oob')
    for name in ['overflow8','overflow8b','read-oob','empty','oversize9','truncated']:
        run([BUILD/'parser-v2',f'fixtures/{name}.bin'],expect=2,contains='result=-1 ',tag='v2-'+name)
    run([BUILD/'parser-v2','fixtures/read-ok.bin'],contains='result=88 ',tag='v2-read-ok')

def types():
    run([BUILD/'lab-ubsan','types'],contains='wide=260 narrowed=4',tag='types')
    run([BUILD/'lab-ubsan','signed'],expect='failure',contains='signed integer overflow',tag='signed')
    run([BUILD/'lab-ubsan','signed-fixed'],expect=2,contains='rejected INT_MAX+1 before addition',tag='signed-fixed')
    run([BUILD/'lab-ubsan','signed-valid'],contains='accepted at_limit=1',tag='signed-valid')
    run([BUILD/'lab-asan','copy'],contains='valid=0 rejected=-1 name=abc cap=4',tag='copy')

def stack():
    run([BUILD/'lab-asan','recurse'],expect='failure',contains='stack-overflow',tag='recursion')
    run([BUILD/'lab-asan','depth-fixed'],expect=2,contains='limit=32',tag='depth-fixed')
    run([BUILD/'lab-asan','depth-valid'],contains='accepted depth=32 result=528',tag='depth-valid')

def investigate():
    baseline=json.loads(run([sys.executable,'analyze.py','investigate'],tag='investigate'))
    assert baseline['correlated_pids']==[410]
    events=[json.loads(x) for x in (ROOT/'fixtures/events.jsonl').read_text().splitlines()]
    for event in events:
        if event['event']=='dns' and event['pid']==410: event['time']='2026-01-01T10:00:30Z'
    with tempfile.TemporaryDirectory(prefix='course-events-') as temp:
        copied=Path(temp)/'events-late.jsonl'
        copied.write_text(''.join(json.dumps(e)+'\n' for e in events))
        negative=json.loads(run([sys.executable,'analyze.py','investigate','--events',copied],tag='investigate-late'))
        assert negative['correlated_pids']==[]
    # Regra e hash permanecem iguais; baseline original intacto volta a corresponder.
    retest=json.loads(run([sys.executable,'analyze.py','investigate'],tag='investigate-retest'))
    assert retest['correlated_pids']==[410] and retest['sha256']==baseline['sha256']

def heap():
    run([BUILD/'lab-asan','uaf'],expect='failure',contains='heap-use-after-free',tag='uaf')
    run([BUILD/'lab-asan','heap-fixed'],contains='saved=42 owner_null=1',tag='heap-fixed')

def canary():
    run([BUILD/'lab-canary','smash'],expect='failure',contains='stack smashing detected',tag='canary')
    run([BUILD/'lab-asan','smash'],expect='failure',contains='stack-buffer-overflow',tag='asan-smash')
    # Não rodar o build sem proteção: UB não tem resultado esperado estável.
    run(['readelf','-sW',BUILD/'lab-canary'],contains='__stack_chk_fail',tag='canary-symbol')
    plain=run(['readelf','-sW',BUILD/'lab-plain'],tag='plain-symbols')
    assert '__stack_chk_fail' not in plain

def maps():
    summary={}
    for name,kind in [('maps-pie','DYN'),('maps-exec','EXEC')]:
        run(['readelf','-h',BUILD/name],contains=kind,tag=name+'-header')
        starts=[]
        for i in range(5):
            output=run([BUILD/name],contains='[stack]',tag=name+f'-run{i}')
            own=[line for line in output.splitlines() if name in line and 'r-xp' in line]
            assert len(own)==1
            starts.append(own[0].split('-')[0])
            assert all('x' not in line.split()[1] for line in output.splitlines() if '[stack]' in line)
        summary[name]={'addresses':starts,'unique':len(set(starts))}
    ph=run(['readelf','-lW',BUILD/'maps-pie'],contains='GNU_STACK',tag='program-headers')
    stackline=next(x for x in ph.splitlines() if 'GNU_STACK' in x)
    assert 'RWE' not in stackline and 'GNU_RELRO' in ph
    run(['readelf','-dW',BUILD/'maps-pie'],contains='BIND_NOW',tag='dynamic-flags')
    # Kernel policy is observed, not modified; no false failure if ASLR disabled.
    summary['aslr_kernel']=Path('/proc/sys/kernel/randomize_va_space').read_text().strip()
    (BUILD/'maps.json').write_text(json.dumps(summary,indent=2))
    print(json.dumps(summary))

def fuzz():
    run([BUILD/'fuzz-fixed'],contains='runs=32 retained=2 bitmap=0x3f',tag='fuzz-fixed')

def triage():
    parser()
    cases=[('overflow8','stack-buffer-overflow','parse_record:name terminator'),
           ('overflow8b','stack-buffer-overflow','parse_record:name terminator'),
           ('read-oob','heap-buffer-overflow','parse_record:record index')]
    groups={}
    for fixture,kind,cause in cases:
        log=(LOG/('v1-'+fixture+'.txt')).read_text()
        assert kind in log
        groups.setdefault(cause,[]).append({'fixture':fixture,'sha256':hashlib.sha256((ROOT/'fixtures'/(fixture+'.bin')).read_bytes()).hexdigest(),'class':kind})
    assert sorted(map(len,groups.values()))==[1,2]
    (BUILD/'triage.json').write_text(json.dumps(groups,indent=2))
    print(json.dumps(groups))

def variants():
    run([BUILD/'variants'],contains='name_v1=1 alias_v1=1 bytes_ok=1 name_v2=0',tag='variants')

if __name__=='__main__':
    p=argparse.ArgumentParser(); p.add_argument('group',choices=['build','parser','types','stack','heap','canary','maps','fuzz','triage','variants','investigate','all']); args=p.parse_args()
    os.chdir(ROOT)
    if args.group=='build': build()
    else:
        if not (BUILD/'parser-v2').exists(): build()
        if args.group=='all':
            for action in [types,parser,stack,heap,canary,maps,fuzz,triage,variants]: action()
            for action in ['entropy','rop']: run([sys.executable,'analyze.py',action],tag=action)
            investigate()
        else: globals()[args.group]()
    (BUILD/('results-'+args.group+'.json')).write_text(json.dumps(RESULT,indent=2)+'\n')
    print(f'PASS group={args.group} checks={len(RESULT)}')

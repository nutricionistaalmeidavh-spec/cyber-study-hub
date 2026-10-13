"""Fixtures próprias, determinísticas e inertes; falhas nunca são ocultadas."""
from pathlib import Path
import hashlib, json, random, zlib
ROOT = Path(__file__).resolve().parent

def main():
    d = ROOT / 'fixtures'
    d.mkdir(exist_ok=True)
    values = {'valid.bin': b'N\x03Ana', 'empty.bin': b'', 'zero.bin': b'N\0',
              'boundary7.bin': b'N\x07ABCDEFG', 'overflow8.bin': b'N\x08ABCDEFGH',
              'overflow8b.bin': b'N\x0812345678', 'oversize9.bin': b'N\x09ABCDEFGHI',
              'truncated.bin': b'N\x04AB', 'read-oob.bin': b'R\x08X',
              'read-ok.bin': b'R\0X', 'entropy-zero.bin': bytes(4096),
              'entropy-uniform.bin': bytes(range(256)) * 16}
    text = (b'CSH educational sample. Name record accepted. This is inert text.\n' * 100)
    values['text.bin'] = text
    values['compressed.bin'] = zlib.compress(text)
    values['random.bin'] = random.Random(160).randbytes(4096)
    values['mixed.bin'] = bytes(2048) + values['random.bin'][:2048]
    values['sample.txt'] = b'CSH-INERT-160\ntraining.invalid\nno executable content\n'
    values['benign.txt'] = b'CSH-INERT-160\nordinary documentation\n'
    for name, content in values.items(): (d / name).write_bytes(content)
    hashes = {name: hashlib.sha256(data).hexdigest() for name, data in values.items()}
    (d / 'manifest.json').write_text(json.dumps(hashes, indent=2) + '\n')
    events = [
        {'time':'2026-01-01T10:00:00Z','pid':410,'event':'process','image':'csh-simulator','parent':100},
        {'time':'2026-01-01T10:00:02Z','pid':410,'event':'file','path':'sample.txt','sha256':hashes['sample.txt']},
        {'time':'2026-01-01T10:00:04Z','pid':410,'event':'dns','query':'training.invalid'},
        {'time':'2026-01-01T10:00:05Z','pid':900,'event':'dns','query':'training.invalid'},
        {'time':'2026-01-01T10:00:08Z','pid':410,'event':'exit','code':0}]
    (d / 'events.jsonl').write_text(''.join(json.dumps(e)+'\n' for e in events))
    print(f'fixtures={len(values)} events={len(events)} manifest=fixtures/manifest.json')
if __name__ == '__main__': main()

"""Defensive educational models, not an OS, loader, PE verifier or kernel."""
from dataclasses import dataclass
import struct, threading, ntpath

def safe_span(capacity,length,present=True):
    if not present or not isinstance(capacity,int) or not isinstance(length,int) or capacity<0 or length<0 or length>capacity:raise ValueError('INVALID_SPAN')
    return length

def allocate_model(ok=True):
    return {'used':1,'freed':1,'failed':False} if ok else {'used':0,'freed':0,'failed':True}

@dataclass(frozen=True)
class Region:
    first:int
    size:int
    rights:frozenset

def virtual_access(r,addr,n,right):
    return n>0 and r.size>0 and r.first<=addr and addr+n<=r.first+r.size and right in r.rights

def thread_counter(workers=2,n=100):
    lock=threading.Lock(); total=[0]
    def worker():
        for _ in range(n):
            with lock:total[0]+=1
    threads=[threading.Thread(target=worker) for _ in range(workers)]
    for t in threads:t.start()
    for t in threads:t.join()
    return total[0]

class HandleTable:
    def __init__(self):self.items={};self.next=1
    def open(self,obj,allowed=True):
        if not allowed:raise PermissionError('ACCESS_DENIED')
        h=self.next;self.next+=1;self.items[h]=obj;return h
    def close(self,h):
        if h not in self.items:raise ValueError('INVALID_HANDLE')
        del self.items[h]

TRUSTED={'helper.dll':r'C:\Program Files\Demo\helper.dll'}
def resolve_library(name):
    if not isinstance(name,str) or name.lower() not in TRUSTED:raise PermissionError('NOT_TRUSTED')
    p=TRUSTED[name.lower()]
    if not ntpath.isabs(p):raise PermissionError('NOT_ABSOLUTE')
    return p

def fake_pe():
    d=bytearray(0x80+24+0xf0+40)
    d[:2]=b'MZ';struct.pack_into('<I',d,0x3c,0x80)
    d[0x80:0x84]=b'PE\0\0'
    struct.pack_into('<HHIIIHH',d,0x84,0x8664,1,0,0,0,0xf0,0)
    struct.pack_into('<H',d,0x98,0x20b)
    return bytes(d)

def parse_pe(d):
    if len(d)<64 or d[:2]!=b'MZ':raise ValueError('DOS_HEADER')
    off=struct.unpack_from('<I',d,0x3c)[0]
    if off>len(d)-24 or d[off:off+4]!=b'PE\0\0':raise ValueError('PE_HEADER')
    machine,sections,_,_,_,opt,_=struct.unpack_from('<HHIIIHH',d,off+4)
    if not 1<=sections<=96 or not 2<=opt<=4096 or off+24+opt+sections*40>len(d):raise ValueError('TRUNCATED')
    if struct.unpack_from('<H',d,off+24)[0] not in (0x10b,0x20b):raise ValueError('OPTIONAL_MAGIC')
    return {'machine':machine,'sections':sections}

def kernel_boundary(capacity,n,rights,operation):
    if operation not in rights:raise PermissionError('DENIED')
    if n<0 or n>capacity:raise ValueError('LIMIT')
    return n

def capstone(rights,operation,module):
    if operation not in rights:raise PermissionError('OBJECT_ACL')
    dll=resolve_library(module)
    table=HandleTable();h=table.open('report.txt');table.close(h)
    return {'object':'report.txt','right':operation,'module':dll,'closed':h not in table.items}

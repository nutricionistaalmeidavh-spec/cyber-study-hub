"""Criar PCAP Ethernet/IPv4/TCP sintético (NÃO é captura real)."""
from pathlib import Path
import struct, tempfile, sys

def checksum(data):
    if len(data)%2: data+=b'\x00'
    s=sum(struct.unpack('!%dH'%(len(data)//2),data))
    while s>0xffff:s=(s & 0xffff)+(s>>16)
    return (~s)&0xffff

def frame():
    import socket
    payload=b'GET /demo HTTP/1.1\r\nHost: localhost\r\n\r\n'
    src=socket.inet_aton('127.0.0.1'); dst=src
    tcp=struct.pack('!HHIIHHHH',40000,18080,1,0,(5<<12)|0x18,4096,0,0)
    pseudoh=src+dst+struct.pack('!BBH',0,6,len(tcp)+len(payload))
    c=checksum(pseudoh+tcp+payload)
    tcp=struct.pack('!HHIIHHHH',40000,18080,1,0,(5<<12)|0x18,4096,c,0)
    ip=struct.pack('!BBHHHBBH4s4s',0x45,0,len(tcp)+len(payload)+20,0x1234,0,64,6,0,src,dst)
    ip=ip[:10]+struct.pack('!H',checksum(ip))+ip[12:]
    eth=b'\x02\x00\x00\x00\x00\x02'+b'\x02\x00\x00\x00\x00\x01'+b'\x08\x00'
    return eth+ip+tcp+payload

def create(path):
    packet=frame()
    header=struct.pack('<IHHIIII',0xa1b2c3d4,2,4,0,0,65535,1)
    record=struct.pack('<IIII',1700000000,0,len(packet),len(packet))
    Path(path).write_bytes(header+record+packet)
    return {'bytes':len(packet),'frames':1,'output':str(path),'synthetic':True}

if __name__=='__main__':
    path=sys.argv[1] if len(sys.argv)>1 else str(Path(tempfile.gettempdir())/'csh_demo.pcap')
    print(create(path))

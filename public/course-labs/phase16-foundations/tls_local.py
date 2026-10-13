"""TLS real em loopback; PCAP reconstruído, não captura de pacotes da interface.
Headers Ethernet/IP/TCP são sintéticos; payloads TLS e ordem vêm do proxy real.
Não use este arquivo para estudar perdas, RTT, retransmissão ou fingerprint TCP.
"""
from pathlib import Path
import json, select, socket, ssl, struct, subprocess, tempfile, threading, time

OUT = Path(__file__).resolve().parent / 'resultados-tls'
OUT.mkdir(exist_ok=True)

def openssl(*args):
    subprocess.run(['openssl', *args], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

def checksum(data):
    if len(data) % 2: data += b'\0'
    value = sum(struct.unpack('!%dH' % (len(data)//2), data))
    while value >> 16: value = (value & 65535) + (value >> 16)
    return (~value) & 65535

def pcap(path, chunks, client_port):
    """Envelopa bytes TLS reais com uma conexão TCP sintética e checksums válidos."""
    frames=[];seq=[1000,9000];ips=[socket.inet_aton('127.0.0.1')]*2;ports=[client_port,443]
    def frame(direction, data=b'', flags=0x18):
        other=1-direction
        tcp=struct.pack('!HHIIBBHHH',ports[direction],ports[other],seq[direction],seq[other],0x50,flags,65535,0,0)
        pseudo=ips[direction]+ips[other]+struct.pack('!BBH',0,6,len(tcp)+len(data))
        tcp=tcp[:16]+struct.pack('!H',checksum(pseudo+tcp+data))+tcp[18:]
        ip=struct.pack('!BBHHHBBH4s4s',0x45,0,20+len(tcp)+len(data),len(frames),0,64,6,0,ips[direction],ips[other])
        ip=ip[:10]+struct.pack('!H',checksum(ip))+ip[12:]
        eth=b'\0'*12+b'\x08\x00'
        frames.append(eth+ip+tcp+data)
        seq[direction]+=len(data)+(1 if flags & 3 else 0)
    frame(0,flags=2);frame(1,flags=0x12);frame(0,flags=0x10)
    for direction,data in chunks:
        for offset in range(0,len(data),1200):frame(direction,data[offset:offset+1200])
    frame(0,flags=0x11);frame(1,flags=0x11);frame(0,flags=0x10)
    with path.open('wb') as f:
        f.write(struct.pack('<IHHIIII',0xa1b2c3d4,2,4,0,0,65535,1))
        for i,body in enumerate(frames):
            f.write(struct.pack('<IIII',1700000000,i*1000,len(body),len(body)));f.write(body)
    return len(frames)

with tempfile.TemporaryDirectory(prefix='CA aula ') as temp:
    base=Path(temp)
    ca, cakey, cert, key, csr, ext=[base/n for n in ['ca.pem','ca.key','server.pem','server.key','server.csr','ext.cnf']]
    ext.write_text('subjectAltName=DNS:localhost\nextendedKeyUsage=serverAuth\nbasicConstraints=CA:FALSE\n',encoding='utf-8')
    openssl('req','-x509','-newkey','rsa:2048','-nodes','-keyout',str(cakey),'-out',str(ca),'-days','1','-subj','/CN=CA didatica local','-addext','basicConstraints=critical,CA:TRUE','-addext','keyUsage=critical,keyCertSign,cRLSign')
    openssl('req','-newkey','rsa:2048','-nodes','-keyout',str(key),'-out',str(csr),'-subj','/CN=localhost')
    openssl('x509','-req','-in',str(csr),'-CA',str(ca),'-CAkey',str(cakey),'-CAcreateserial','-out',str(cert),'-days','1','-extfile',str(ext))
    (OUT/'ca-publica.pem').write_bytes(ca.read_bytes())
    ctx=ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER);ctx.load_cert_chain(cert,key)
    listener=socket.socket();listener.bind(('127.0.0.1',0));listener.listen();listener.settimeout(.2)
    port=listener.getsockname()[1];stop=threading.Event();errors=[]
    def serve():
        while not stop.is_set():
            try:conn,_=listener.accept()
            except socket.timeout:continue
            except OSError:break
            conn.settimeout(2)
            try:
                with ctx.wrap_socket(conn,server_side=True) as stream:
                    request=b''
                    while b'\r\n\r\n' not in request:
                        part=stream.recv(4096)
                        if not part:break
                        request+=part
                        if len(request)>16384:raise ValueError('request grande')
                    if request:
                        body=b'{"segredo_didatico":"MARCADOR_TLS_16"}'
                        stream.sendall(b'HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: '+str(len(body)).encode()+b'\r\nConnection: close\r\n\r\n'+body)
            except (ssl.SSLError, OSError):conn.close() # clientes negativos encerram handshake
            except Exception as e:errors.append(repr(e));conn.close()
    thread=threading.Thread(target=serve);thread.start()
    results=[]
    try:
        for label,version in [('TLS12',ssl.TLSVersion.TLSv1_2),('TLS13',ssl.TLSVersion.TLSv1_3)]:
            proxy=socket.socket();proxy.bind(('127.0.0.1',0));proxy.listen();proxy_port=proxy.getsockname()[1]
            chunks=[];proxy_errors=[]
            def relay():
                try:
                    downstream,_=proxy.accept()
                    with downstream, socket.create_connection(('127.0.0.1',port),2) as upstream:
                        sockets=[downstream,upstream]
                        while True:
                            ready,_,_=select.select(sockets,[],[],3)
                            if not ready:break
                            for current in ready:
                                data=current.recv(65535)
                                if not data:return
                                direction=0 if current is downstream else 1
                                chunks.append((direction,data))
                                sockets[1-direction].sendall(data)
                except Exception as e:proxy_errors.append(repr(e))
            relay_thread=threading.Thread(target=relay);relay_thread.start()
            client=ssl.create_default_context(cafile=str(ca));client.minimum_version=version;client.maximum_version=version
            keylog=OUT/f'{label}.keys'
            if keylog.exists():keylog.unlink()
            client.keylog_filename=str(keylog)
            with socket.create_connection(('127.0.0.1',proxy_port),2) as raw:
                with client.wrap_socket(raw,server_hostname='localhost') as secure:
                    negotiated_version=secure.version()
                    assert negotiated_version == ('TLSv1.2' if label == 'TLS12' else 'TLSv1.3')
                    secure.sendall(b'GET /segredo HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n')
                    response=b''
                    while True:
                        part=secure.recv(4096)
                        if not part:break
                        response+=part
                    assert b'200 OK' in response and b'MARCADOR_TLS_16' in response
                    result={'caso':label,'versao':negotiated_version,'cifra':secure.cipher()[0],'HTTP':200,'hostname_verificado':'localhost'}
            relay_thread.join(5);proxy.close()
            assert not relay_thread.is_alive() and not proxy_errors,proxy_errors
            raw_tls=b''.join(data for _,data in chunks)
            assert b'MARCADOR_TLS_16' not in raw_tls and b'GET /segredo' not in raw_tls
            result['frames_reconstruidos']=pcap(OUT/f'{label}-reconstruido.pcap',chunks,50012 if label=='TLS12' else 50013)
            result['payload_TLS_real']=True;result['headers_TCP_sinteticos']=True
            (OUT/f'{label}-fluxo.json').write_text(json.dumps([{'direcao':'cliente-servidor' if d==0 else 'servidor-cliente','bytes':len(b),'hex':b.hex()} for d,b in chunks],indent=2),encoding='utf-8')
            results.append(result)
        for label,trust,hostname in [('CA-nao-confiavel',False,'localhost'),('hostname-incorreto',True,'outro.local')]:
            client=ssl.create_default_context(cafile=str(ca) if trust else None)
            try:
                with socket.create_connection(('127.0.0.1',port),2) as raw:
                    with client.wrap_socket(raw,server_hostname=hostname):pass
            except ssl.SSLCertVerificationError as error:
                results.append({'caso':label,'resultado':'rejeitado','motivo':error.verify_message})
            else:raise AssertionError(label+' foi aceito')
    finally:
        stop.set();listener.close();thread.join(5)
    assert not errors and not thread.is_alive(),errors
    (OUT/'resultados.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (OUT/'LEIA-ME.txt').write_text('Payloads de TLS real em loopback. Ethernet/IP/TCP, timestamps e ACKs reconstruídos didaticamente: NÃO são captura de interface. Não inferir RTT, perda, retransmissão ou fingerprint. Arquivos .keys são segredos apenas destas sessões sintéticas e permitem ler o HTTP do lab. CA pública expira em um dia; gere novamente para novos testes. Chaves privadas de CA/servidor foram apagadas com a pasta temporária.\n',encoding='utf-8')
    print(json.dumps(results,ensure_ascii=False,indent=2))

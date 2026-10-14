"""Experimento local: TCP e UDP só em 127.0.0.1, portas atribuídas pelo SO."""
import socket

def run():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.bind(('127.0.0.1', 0))
        server.listen(1)
        server.settimeout(2)
        port_tcp=server.getsockname()[1]
        with socket.create_connection(('127.0.0.1', port_tcp),timeout=2) as client:
            connected, _=server.accept()
            with connected:
                client.sendall(b'PING')
                received=connected.recv(4)
                connected.sendall(b'PONG' if received==b'PING' else b'ERR')
                got=client.recv(4)
        assert got==b'PONG'
    with socket.socket(socket.AF_INET,socket.SOCK_DGRAM) as srv:
        srv.bind(('127.0.0.1',0)); srv.settimeout(2)
        port_udp=srv.getsockname()[1]
        with socket.socket(socket.AF_INET,socket.SOCK_DGRAM) as cl:
            cl.settimeout(2)
            cl.sendto(b'HELLO',('127.0.0.1',port_udp))
            packet, addr = srv.recvfrom(256)
            srv.sendto(b'ACK' if packet==b'HELLO' else b'ERR', addr)
            answer,_=cl.recvfrom(256)
            assert answer==b'ACK'
    return {'tcp_port':port_tcp,'tcp_reply':got.decode(),'udp_port':port_udp,'udp_reply':answer.decode(),'bind':'127.0.0.1'}

if __name__=='__main__':
    print(run())

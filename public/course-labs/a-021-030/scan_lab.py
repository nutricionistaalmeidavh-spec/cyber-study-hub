"""Sondar apenas duas portas TCP de sockets próprios, jamais outros alvos."""
import socket

def run():
    with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as listening:
        listening.bind(('127.0.0.1',0));listening.listen(1)
        port_listen=listening.getsockname()[1]
        with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as temp:
            temp.bind(('127.0.0.1',0)); port_closed=temp.getsockname()[1]
            # A porta não está em listen; mantemos o bind para reduzir race.
            with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as cl:
                cl.settimeout(1); success=cl.connect_ex(('127.0.0.1',port_listen))
            with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as cl:
                cl.settimeout(1); failure=cl.connect_ex(('127.0.0.1',port_closed))
        assert success==0 and failure!=0, (success, failure)
        return {'open_tcp':port_listen, 'closed_tcp':port_closed,'connected':success==0,'refused':failure!=0,'scope':'127.0.0.1 only'}
if __name__=='__main__':print(run())

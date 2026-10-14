"""Permissões apenas em arquivos descartáveis do usuário corrente, sem sudo."""
import os, stat, tempfile
from pathlib import Path

def run():
    with tempfile.TemporaryDirectory(prefix='csh-permissions-') as tmp:
        folder=Path(tmp)/'private'; folder.mkdir(mode=0o700); os.chmod(folder,0o700)
        note=folder/'note.txt'; note.write_text('conteudo ficticio\n',encoding='utf8'); os.chmod(note,0o600)
        perms_dir=stat.S_IMODE(folder.stat().st_mode)
        perms_file=stat.S_IMODE(note.stat().st_mode)
        assert note.read_text(encoding='utf8')=='conteudo ficticio\n'
        return {'directory':oct(perms_dir),'file':oct(perms_file),'current_uid':os.getuid() if hasattr(os,'getuid') else 'not_available'}
if __name__=='__main__':print(run())

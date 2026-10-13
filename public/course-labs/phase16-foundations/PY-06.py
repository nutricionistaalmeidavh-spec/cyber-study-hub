from pathlib import Path
import tempfile


def resumir(origem, destino):
    # with fecha cada arquivo mesmo se a leitura ou escrita lançar exceção.
    with Path(origem).open("r", encoding="utf-8") as entrada:
        nomes = [linha.strip() for linha in entrada if linha.strip()]
    # Somente escrevemos depois de a leitura inteira terminar com sucesso.
    with Path(destino).open("w", encoding="utf-8", newline="\n") as saida:
        saida.write(f"registros={len(nomes)}\n")
    return nomes

if __name__ == "__main__":
    # Pasta temporária própria: não sobrescreve documentos do aluno.
    with tempfile.TemporaryDirectory(prefix="aula arquivos ") as pasta:
        base = Path(pasta)
        origem, destino = base / "nomes ação.txt", base / "resumo.txt"
        origem.write_text("Ana\nJoão\n\n", encoding="utf-8")
        assert resumir(origem, destino) == ["Ana", "João"]
        assert destino.read_text(encoding="utf-8") == "registros=2\n"
        try:
            resumir(base / "ausente.txt", destino)
        except FileNotFoundError:
            print("ausente: arquivo não encontrado; resumo preservado")
        else:
            raise AssertionError("ausente deveria falhar")
        assert destino.read_text(encoding="utf-8") == "registros=2\n"
        print("UTF-8: João; registros=2; caminhos com espaços OK")

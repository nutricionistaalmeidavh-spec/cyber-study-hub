def converter(texto, trilha):
    try:
        numero = int(texto)
    except ValueError:  # texto inválido é uma falha prevista
        trilha.append("formato inválido")
        return None
    else:
        trilha.append("conversão concluída")
        return numero
    finally:
        trilha.append("finalizado")  # não faça return aqui: ocultaria o resultado/erro

if __name__ == "__main__":
    for entrada, esperado, eventos in [
        ("12", 12, ["conversão concluída", "finalizado"]),
        ("x", None, ["formato inválido", "finalizado"]),
    ]:
        trilha = []
        assert converter(entrada, trilha) == esperado
        assert trilha == eventos
        print(repr(entrada), esperado, trilha)
    trilha = []
    try:
        converter(None, trilha)  # TypeError: defeito do chamador; não esconder
    except TypeError:
        assert trilha == ["finalizado"]
        print("TypeError propagado; finally executado")
    else:
        raise AssertionError("TypeError foi ocultado")

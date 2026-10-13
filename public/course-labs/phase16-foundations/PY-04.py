def subtotal(preco, quantidade):
    """Recebe centavos/quantidade inteiros não negativos; retorna centavos."""
    # bool é subtipo de int em Python; este contrato recusa bool explicitamente.
    if type(preco) is not int or type(quantidade) is not int:
        raise TypeError("esperados inteiros")
    if preco < 0 or quantidade < 0:
        raise ValueError("valores negativos")
    valor = preco * quantidade  # variável local; não altera o chamador
    return valor

if __name__ == "__main__":
    valor = 99
    assert subtotal(250, 3) == 750
    assert subtotal(250, 0) == 0
    assert valor == 99
    for args, erro in [((-1, 2), ValueError), ((True, 2), TypeError)]:
        try:
            subtotal(*args)
        except erro:
            pass
        else:
            raise AssertionError(f"deveria rejeitar {args}")
    print("subtotal=750; zero=0; externo=99; inválidos rejeitados")

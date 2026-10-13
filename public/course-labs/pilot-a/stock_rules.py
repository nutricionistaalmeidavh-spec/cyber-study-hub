"""LOG-01: pequena regra determinística, não um controle de concorrência."""

def reserve(stock, request):
    if type(stock) is not int or stock < 0:
        return 'erro-estoque', stock
    if type(request) is not int or request <= 0:
        return 'invalido', stock
    if request > stock:
        return 'recusar', stock
    return 'aceitar', stock - request


def main():
    cases = [((7, 4), ('aceitar', 3)), ((7, 8), ('recusar', 7)),
             ((7, 0), ('invalido', 7)), ((0, 1), ('recusar', 0)),
             ((5, 5), ('aceitar', 0)), ((5, 2.5), ('invalido', 5)),
             ((3, -2), ('invalido', 3)), ((-1, 2), ('erro-estoque', -1)),
             ((True, 1), ('erro-estoque', True))]
    for (stock, request), expected in cases:
        actual = reserve(stock, request)
        assert actual == expected, f'{(stock,request)}: {actual} != {expected}'
        print(f'entrada=({stock!r},{request!r}) → {actual!r}')
    print('PASS: 9 casos de estoque e invariantes')


if __name__ == '__main__':
    main()

"""Exemplos autorais LOG-03/06/08..20. Python 3.10+, somente biblioteca padrão.
Nada é lido da rede ou persistido. Execute: python3 logic_lab.py LOG-03.
"""
from collections import deque
import json
import re
import sys


def expressions():
    return {
        "precedencia": [2 + 3 * 4, (2 + 3) * 4],
        "texto_e_numero": ["2" + "3", int("2") + 3],
        "curto_circuito": 0 != 0 and 10 / 0 > 2,
        "tabela": [[a, b, a and b, a or b, not a]
                   for a, b in [(False, False), (False, True),
                                (True, False), (True, True)]]}


def element_at(values, index):
    # Contrato deliberado: índices não negativos; Python permite -1 diretamente.
    if type(index) is not int or not 0 <= index < len(values):
        raise IndexError("INDICE_INVALIDO")
    return values[index]


def collections_demo():
    values = [12, 0, 7]
    return {"percurso": list(enumerate(values)), "soma": sum(values),
            "ultimo": element_at(values, 2), "vazia": list(enumerate([]))}


SALDO = 100


def local_balance():
    SALDO = 20  # nome local; não reatribui o nome do módulo
    SALDO += 5
    return SALDO


def scope_demo():
    before = SALDO
    inside = local_balance()
    numbers = [1]
    alias = numbers
    alias.append(2)  # mutação compartilhada não é reatribuição do nome numbers
    return {"antes": before, "local": inside, "depois": SALDO,
            "lista_compartilhada": numbers}


def recursive_sum(n):
    if type(n) is not int or not 0 <= n <= 100:
        raise ValueError("N_ENTRE_0_E_100")
    if n == 0:
        return 0
    return n + recursive_sum(n - 1)


def structures_demo():
    stack = ["A", "B", "C"]
    queue = deque(["A", "B", "C"])
    counts = {}
    for name in ["A", "B", "A"]:
        counts[name] = counts.get(name, 0) + 1
    return {"pilha": [stack.pop() for _ in range(3)],
            "fila": [queue.popleft() for _ in range(3)], "mapa": counts}


def parse_order(text):
    if not isinstance(text, str):
        raise TypeError("TEXTO_ESPERADO")
    if re.fullmatch(r"[0-9]{1,2};[0-9]{1,6}", text) is None:
        raise ValueError("FORMATO_QTD_PRECO")
    quantity, price = map(int, text.split(";"))
    if not 1 <= quantity <= 99 or not 0 <= price <= 100000:
        raise ValueError("INTERVALO_INVALIDO")
    return quantity, price


def order_pipeline(text):
    quantity, price = parse_order(text)
    total = quantity * price
    return {"quantidade": quantity, "unitario_centavos": price,
            "total_centavos": total,
            "exibicao": f"{total // 100},{total % 100:02d}"}


TRANSITIONS = {
    ("rascunho", "confirmar"): "confirmado",
    ("rascunho", "cancelar"): "cancelado",
    ("confirmado", "pagar"): "pago",
    ("confirmado", "cancelar"): "cancelado",
}


def transition(state, event):
    if (state, event) not in TRANSITIONS:
        raise ValueError("TRANSICAO_INVALIDA")
    return TRANSITIONS[state, event]


def state_demo():
    state = "rascunho"
    trace = [state]
    for event in ["confirmar", "pagar"]:
        state = transition(state, event)
        trace.append(state)
    try:
        state = transition(state, "cancelar")
    except ValueError as error:
        return {"estados": trace, "rejeicao": str(error), "final": state}


def first_index(values, target):
    for index, value in enumerate(values):
        if value == target:
            return index
    return None


def at_least(values, minimum):
    return [value for value in values if value >= minimum]


def search_demo():
    data = [4, 2, 4, 7]
    return {"primeiro_4": first_index(data, 4),
            "primeiro_9": first_index(data, 9),
            "filtro_4": at_least(data, 4), "filtro_8": at_least(data, 8)}


def summarize(values):
    count = 0
    total = 0
    has_negative = False
    trace = []
    for value in values:
        if value > 0:
            count += 1
            total += value
        if value < 0:
            has_negative = True
        trace.append([value, count, total, has_negative])
    return {"positivos": count, "soma_positivos": total,
            "tem_negativo": has_negative, "rastro": trace}


def validate_item(code, quantity):
    if type(code) is not str or type(quantity) is not int:
        raise TypeError("TIPO_INVALIDO")
    if re.fullmatch(r"SKU-[0-9]{3}", code) is None:
        raise ValueError("FORMATO_INVALIDO")
    if not 1 <= quantity <= 10:
        raise ValueError("INTERVALO_INVALIDO")
    return {"codigo": code, "quantidade": quantity}


def parse_positive(text):
    if not isinstance(text, str):
        raise TypeError("TEXTO_ESPERADO")
    if re.fullmatch(r"[0-9]{1,2}", text) is None:
        raise ValueError("FORMATO_INVALIDO")
    value = int(text)
    if not 1 <= value <= 99:
        raise ValueError("INTERVALO_INVALIDO")
    return value


def process_batch(lines):
    total = 0
    errors = []
    for line_number, text in enumerate(lines, 1):
        try:
            value = parse_positive(text)
        except ValueError as error:
            errors.append({"linha": line_number, "motivo": str(error)})
        else:
            total += value
    return {"total": total, "erros": errors}


def maximum_bug(values):
    best = 0
    for value in values:
        if value > best:
            best = value
    return best


def maximum(values):
    best = None
    for value in values:
        if best is None or value > best:
            best = value
    return best


def unique_nonempty(labels):
    """Código a ser lido antes da execução em LOG-18; domínio: strings."""
    seen = set()
    result = []
    for label in labels:
        key = label.strip().lower()
        if key and key not in seen:
            seen.add(key)
            result.append(key)
    return result


def old_delivery(subtotal, vip):
    if type(subtotal) is not int or subtotal < 0 or type(vip) is not bool:
        raise ValueError("PEDIDO_INVALIDO")
    if vip:
        fee = 0
    else:
        if subtotal >= 5000:
            fee = 0
        else:
            fee = 500
    return subtotal + fee


def new_delivery(subtotal, vip):
    if type(subtotal) is not int or subtotal < 0 or type(vip) is not bool:
        raise ValueError("PEDIDO_INVALIDO")
    fee = 0 if vip or subtotal >= 5000 else 500
    return subtotal + fee


STOCK = {"caderno": 3, "caneta": 2}
REQUESTS = [
    {"id": "p1", "item": "caderno", "qtd": 2},
    {"id": "p2", "item": "caderno", "qtd": 2},
    {"id": "p3", "item": "caneta", "qtd": 1},
    {"id": "p1", "item": "caneta", "qtd": 1},
    {"id": "p4", "item": "borracha", "qtd": 1},
    {"id": "p5", "item": "caneta", "qtd": 0},
]


def reserve(stock, requests):
    """Domínio: stock válido de inteiros >=0; requests são dicionários.
    Executa sequencialmente em memória; não é protocolo para concorrência.
    """
    remaining = dict(stock)
    accepted = []
    rejected = []
    accepted_ids = set()
    for request in requests:
        identifier = request.get("id")
        item = request.get("item")
        quantity = request.get("qtd")
        reason = None
        if (type(identifier) is not str or not identifier
                or type(item) is not str or type(quantity) is not int
                or quantity < 1):
            reason = "ENTRADA_INVALIDA"
        elif identifier in accepted_ids:
            reason = "ID_JA_ACEITO"
        elif item not in remaining:
            reason = "ITEM_DESCONHECIDO"
        elif quantity > remaining[item]:
            reason = "ESTOQUE_INSUFICIENTE"
        if reason:
            rejected.append({"id": identifier, "motivo": reason})
            continue
        remaining[item] -= quantity
        accepted_ids.add(identifier)
        accepted.append(dict(request))
    return {"estoque": remaining, "aceitos": accepted, "rejeitados": rejected,
            "pedidos_aceitos": len(accepted),
            "unidades_reservadas": sum(p["qtd"] for p in accepted)}


def validation_demo():
    outcomes = []
    for code, quantity in [("SKU-007", 1), ("SKU-007", 10), ("sku-007", 1),
                           ("SKU-007", 0), ("SKU-007", True)]:
        try:
            result = validate_item(code, quantity)
        except (ValueError, TypeError) as error:
            result = str(error)
        outcomes.append({"entrada": [code, quantity], "resultado": result})
    return outcomes


DEMOS = {
    "LOG-03": expressions,
    "LOG-06": collections_demo,
    "LOG-08": scope_demo,
    "LOG-09": lambda: {"soma_3": recursive_sum(3), "soma_0": recursive_sum(0)},
    "LOG-10": structures_demo,
    "LOG-11": lambda: order_pipeline("2;350"),
    "LOG-12": state_demo,
    "LOG-13": search_demo,
    "LOG-14": lambda: summarize([-2, 0, 5, 7]),
    "LOG-15": validation_demo,
    "LOG-16": lambda: process_batch(["2", "x", "0", "3"]),
    "LOG-17": lambda: {"bug": maximum_bug([-4, -2]),
                          "corrigido": maximum([-4, -2]), "vazio": maximum([])},
    "LOG-18": lambda: unique_nonempty([" Ana ", "", "ANA", "Bia", " bia "]),
    "LOG-19": lambda: [{"subtotal": n, "vip": vip,
                         "antes": old_delivery(n, vip), "depois": new_delivery(n, vip)}
                        for n, vip in [(0, False), (4999, False), (5000, False), (100, True)]],
    "LOG-20": lambda: reserve(STOCK, REQUESTS),
}

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in DEMOS:
        print("Uso: python3 logic_lab.py " + "|".join(DEMOS), file=sys.stderr)
        raise SystemExit(2)
    print(json.dumps(DEMOS[sys.argv[1]](), ensure_ascii=False, indent=2))

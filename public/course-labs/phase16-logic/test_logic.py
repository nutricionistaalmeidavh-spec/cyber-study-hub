"""Casos de referência derivados dos contratos, não da saída dos demos."""
import copy
import unittest
import logic_lab as lab


class LogicTests(unittest.TestCase):
    def test_log03(self):
        result = lab.expressions()
        self.assertEqual(result["precedencia"], [14, 20])
        self.assertEqual(result["texto_e_numero"], ["23", 5])
        self.assertIs(result["curto_circuito"], False)
        self.assertEqual([row[2] for row in result["tabela"]], [False, False, False, True])

    def test_log06(self):
        self.assertEqual(lab.element_at([12, 0, 7], 2), 7)
        for values, index in [([], 0), ([12, 0, 7], 3), ([7], 1), ([7], -1), ([7], True)]:
            with self.assertRaisesRegex(IndexError, "INDICE_INVALIDO"):
                lab.element_at(values, index)

    def test_log08(self):
        self.assertEqual(lab.scope_demo(), {"antes": 100, "local": 25, "depois": 100,
                                           "lista_compartilhada": [1, 2]})
        self.assertEqual(lab.local_balance(), 25)
        self.assertEqual(lab.SALDO, 100)

    def test_log09(self):
        for value, expected in [(0, 0), (1, 1), (3, 6), (100, 5050)]:
            self.assertEqual(lab.recursive_sum(value), expected)
        for bad in [-1, 101, True, 1.5]:
            with self.assertRaises(ValueError):
                lab.recursive_sum(bad)

    def test_log10(self):
        self.assertEqual(lab.structures_demo(), {"pilha": ["C", "B", "A"],
                                               "fila": ["A", "B", "C"], "mapa": {"A": 2, "B": 1}})

    def test_log11(self):
        self.assertEqual(lab.order_pipeline("2;350"), {"quantidade": 2, "unitario_centavos": 350,
                                                     "total_centavos": 700, "exibicao": "7,00"})
        self.assertEqual(lab.order_pipeline("1;0")["exibicao"], "0,00")
        self.assertEqual(lab.order_pipeline("99;100000")["total_centavos"], 9900000)
        for bad in ["0;350", "2;100001", "2;3.50", "2;350;1", " 2;350", "100;1"]:
            with self.assertRaises(ValueError):
                lab.order_pipeline(bad)

    def test_log12(self):
        self.assertEqual(lab.transition("rascunho", "confirmar"), "confirmado")
        self.assertEqual(lab.transition("confirmado", "cancelar"), "cancelado")
        for state, event in [("rascunho", "pagar"), ("pago", "cancelar"), ("cancelado", "confirmar")]:
            with self.assertRaisesRegex(ValueError, "TRANSICAO_INVALIDA"):
                lab.transition(state, event)
        self.assertEqual(lab.state_demo()["final"], "pago")

    def test_log13(self):
        self.assertEqual(lab.first_index([4, 2, 4], 4), 0)
        self.assertIsNone(lab.first_index([], 4))
        self.assertEqual(lab.at_least([4, 2, 4, 7], 4), [4, 4, 7])
        self.assertEqual(lab.at_least([4, 2], 8), [])

    def test_log14(self):
        self.assertEqual(lab.summarize([-2, 0, 5, 7]), {"positivos": 2, "soma_positivos": 12,
            "tem_negativo": True, "rastro": [[-2, 0, 0, True], [0, 0, 0, True],
                                            [5, 1, 5, True], [7, 2, 12, True]]})
        self.assertEqual(lab.summarize([])["soma_positivos"], 0)
        self.assertFalse(lab.summarize([0])["tem_negativo"])

    def test_log15(self):
        for quantity in [1, 10]:
            self.assertEqual(lab.validate_item("SKU-007", quantity)["quantidade"], quantity)
        for quantity in [0, 11]:
            with self.assertRaisesRegex(ValueError, "INTERVALO_INVALIDO"):
                lab.validate_item("SKU-007", quantity)
        for quantity in [True, "2", 2.0]:
            with self.assertRaisesRegex(TypeError, "TIPO_INVALIDO"):
                lab.validate_item("SKU-007", quantity)
        for code in ["sku-007", "SKU-07", "SKU-007\n"]:
            with self.assertRaisesRegex(ValueError, "FORMATO_INVALIDO"):
                lab.validate_item(code, 1)

    def test_log16(self):
        self.assertEqual(lab.process_batch(["2", "x", "0", "3"]), {"total": 5, "erros": [
            {"linha": 2, "motivo": "FORMATO_INVALIDO"}, {"linha": 3, "motivo": "INTERVALO_INVALIDO"}]})
        self.assertEqual(lab.process_batch([]), {"total": 0, "erros": []})
        with self.assertRaises(TypeError):
            lab.process_batch([2])

    def test_log17(self):
        self.assertEqual(lab.maximum_bug([-4, -2]), 0)
        for values, expected in [([-4, -2], -2), ([], None), ([0], 0), ([7, 7], 7), ([1, 9, 2], 9)]:
            self.assertEqual(lab.maximum(values), expected)

    def test_log18(self):
        original = [" Ana ", "", "ANA", "Bia", " bia "]
        before = original.copy()
        self.assertEqual(lab.unique_nonempty(original), ["ana", "bia"])
        self.assertEqual(original, before)
        self.assertEqual(lab.unique_nonempty(["  "]), [])
        self.assertEqual(lab.unique_nonempty(["B", "A", "B"]), ["b", "a"])

    def test_log19(self):
        for subtotal, vip, expected in [(0, False, 500), (4999, False, 5499),
                                         (5000, False, 5000), (100, True, 100)]:
            self.assertEqual(lab.old_delivery(subtotal, vip), expected)
            self.assertEqual(lab.new_delivery(subtotal, vip), expected)
        for subtotal in range(0, 5002):
            for vip in [False, True]:
                self.assertEqual(lab.old_delivery(subtotal, vip), lab.new_delivery(subtotal, vip))
        for function in [lab.old_delivery, lab.new_delivery]:
            for subtotal, vip in [(-1, False), (True, False), (1, 1)]:
                with self.assertRaisesRegex(ValueError, "PEDIDO_INVALIDO"):
                    function(subtotal, vip)

    def test_log20(self):
        stock = copy.deepcopy(lab.STOCK)
        requests = copy.deepcopy(lab.REQUESTS)
        result = lab.reserve(stock, requests)
        self.assertEqual(result["estoque"], {"caderno": 1, "caneta": 1})
        self.assertEqual([r["id"] for r in result["aceitos"]], ["p1", "p3"])
        self.assertEqual(result["pedidos_aceitos"], 2)
        self.assertEqual(result["unidades_reservadas"], 3)
        self.assertEqual([r["motivo"] for r in result["rejeitados"]], ["ESTOQUE_INSUFICIENTE",
            "ID_JA_ACEITO", "ITEM_DESCONHECIDO", "ENTRADA_INVALIDA"])
        self.assertEqual(stock, lab.STOCK)
        self.assertEqual(requests, lab.REQUESTS)
        for item in stock:
            used = sum(r["qtd"] for r in result["aceitos"] if r["item"] == item)
            self.assertEqual(stock[item], result["estoque"][item] + used)
        self.assertEqual(lab.reserve({}, [])["pedidos_aceitos"], 0)
        retried = lab.reserve({"x": 1}, [{"id": "a", "item": "x", "qtd": 2},
                                        {"id": "a", "item": "x", "qtd": 1}])
        self.assertEqual(retried["pedidos_aceitos"], 1)


if __name__ == "__main__":
    unittest.main()

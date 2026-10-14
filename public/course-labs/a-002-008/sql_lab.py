"""SQLi educacional em SQLite em memória. Não abre arquivos de banco nem sockets."""
import sqlite3
import unittest


def fixture():
    db = sqlite3.connect(':memory:')
    db.execute('CREATE TABLE pedidos(id TEXT, owner TEXT, descricao TEXT)')
    db.executemany('INSERT INTO pedidos VALUES(?,?,?)', [
        ('R10', 'ana', 'livro'), ('R11', 'bia', 'caderno')])
    return db


def insecure_search(db, pedido):
    # Apenas uma demonstração local de como NÃO escrever uma consulta.
    return db.execute("SELECT id FROM pedidos WHERE id = '" + pedido + "'").fetchall()


def secure_search(db, pedido):
    return db.execute('SELECT id FROM pedidos WHERE id = ?', (pedido,)).fetchall()


def secure_owner_search(db, pedido, owner):
    return db.execute('SELECT id FROM pedidos WHERE id = ? AND owner = ?', (pedido, owner)).fetchall()


class TestSqlLab(unittest.TestCase):
    def setUp(self):
        self.db = fixture()

    def tearDown(self):
        self.db.close()

    def test_normal(self):
        self.assertEqual(secure_search(self.db, 'R10'), [('R10',)])

    def test_input_literal_vs_sql_injection(self):
        demo = "' OR 1=1 --"
        self.assertEqual(len(insecure_search(self.db, demo)), 2)
        self.assertEqual(secure_search(self.db, demo), [])

    def test_apostrophe_ordinary(self):
        self.assertEqual(secure_search(self.db, "O'Hara"), [])

    def test_bound_values_are_not_authorization(self):
        self.assertEqual(secure_owner_search(self.db, 'R11', 'ana'), [])
        self.assertEqual(secure_owner_search(self.db, 'R11', 'bia'), [('R11',)])


if __name__ == '__main__':
    unittest.main(verbosity=2)

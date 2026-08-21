import sqlite3

conexao = sqlite3.connect("banco_master.db")
cursor = conexao.cursor()

cursor.execute(
    """
    Select from * tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_empresa TEXT NOT NULL,
        cnpj TEXT UNIQUE NOT NULL,
        nome_banco TEXT NOT NULL
    )
"""
)

conexao.commit()
conexao.close()
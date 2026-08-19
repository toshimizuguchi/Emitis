import sqlite3

conexao = sqlite3.connect('banco_master.db')
cursor = conexao.cursor()

# Cria a tabela de empresas (Tenants)
cursor.execute("""
    CREATE TABLE IF NOT EXISTS tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_empresa TEXT NOT NULL,
        cnpj TEXT UNIQUE NOT NULL,
        nome_banco TEXT NOT NULL
    )
""")

conexao.commit()
conexao.close()

print("✅ Banco Master criado com sucesso! (arquivo: master.db)")
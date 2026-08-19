import sqlite3

# 1. Conecta no arquivo com o nome EXATO que aparece no seu VS Code
conexao = sqlite3.connect("banco_tenant.db")
cursor = conexao.cursor()

# 2. Cadastra o cliente
cursor.execute("""
    INSERT INTO clientes (nome, cpf_cnpj, email)
    VALUES ('Empresa ABC Ltda', '12.345.678/0001-90', 'contato@abc.com')
""")

cliente_id = cursor.lastrowid

# 3. Cadastra a nota fiscal
cursor.execute("""
    INSERT INTO notas_fiscais (cliente_id, valor, descricao, status)
    VALUES (?, ?, ?, ?)
""", (cliente_id, 1500.00, 'Serviços de Desenvolvimento de Software', 'EMITIDA'))

conexao.commit()
conexao.close()

print("✅ Dados inseridos com sucesso no banco_tenant.db!")
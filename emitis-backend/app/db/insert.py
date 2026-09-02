import sqlite3

conexao = sqlite3.connect("banco_master.db")
cursor = conexao.cursor()

cursor.execute(
    """
    INSERT INTO tenants (
        
    )
"""
)

conexao.commit()
conexao.close()
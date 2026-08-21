# 🚀 Emitis - Backend SaaS Multi-Tenant

O **Emitis** é uma plataforma SaaS (Software as a Service) desenvolvida para simplificar a gestão de clientes e a emissão automatizada de notas fiscais. 

O projeto foi projetado do zero utilizando uma **arquitetura multi-tenant com banco de dados isolado**, garantindo total privacidade, segurança e conformidade no armazenamento dos dados fiscais de cada empresa assinante.

---

## 🎯 Principais Funcionalidades

- 🏢 **Gerenciamento Multi-Tenant:** Banco de dados central (`Master`) para controle de empresas assinantes e bancos de dados individuais para cada cliente (`Tenant`).
- 👥 **Gestão de Clientes:** Cadastro e organização dos tomadores de serviço / compradores.
- 🧾 **Controle Fiscal:** Registro, vinculação de clientes e acompanhamento do status de emissão de notas fiscais.
- 🔒 **Isolamento de Dados:** Cada empresa possui sua própria base de dados relacional independente.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** Python 3.14+
- **Banco de Dados (Dev):** SQLite3
- **Framework (Em breve):** FastAPI & SQLAlchemy
- **Ferramentas:** VS Code, SQLite Viewer

---

## 📁 Estrutura do Projeto

```text
emitis/
├── app/
│   └── db/
│       ├── banco_master.py     # Script de criação da Base Central (Master)
│       └── banco_tenant.py     # Script de criação da Base Individual (Tenant)
│
├── master.db                   # Base de dados central (Gerencia os assinantes)
├── banco_tenant.db             # Base de dados isolada de demonstração/tenant
└── README.md                   # Documentação do projeto
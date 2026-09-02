# Emitis — Plataforma SaaS de Gestão Fiscal Multi-Tenant

<div align="center">

**Gerencie clientes e emita notas fiscais com total isolamento de dados por empresa.**

[![Python](https://img.shields.io/badge/Python-3.14+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Em%20breve-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org)

</div>

---

## Sobre o Projeto

O **Emitis** é uma plataforma SaaS *(Software as a Service)* desenvolvida do zero para simplificar a gestão de clientes e o controle da emissão de notas fiscais de pequenas e médias empresas.

O sistema foi arquitetado com um modelo **multi-tenant com banco de dados isolado**: cada empresa assinante possui sua própria base de dados relacional independente, garantindo privacidade total, segurança dos dados fiscais e conformidade sem que um tenant tenha acesso às informações do outro.

---

## Funcionalidades

| Módulo | Descrição |
|---|---|
| 🏢 **Multi-Tenant** | Banco central (`Master`) controla as empresas assinantes; cada assinante tem seu banco individual (`Tenant`) |
| 👥 **Gestão de Clientes** | Cadastro completo de tomadores de serviço (Pessoa Física e Jurídica) com CPF/CNPJ, contato e endereço |
| 🧾 **Notas Fiscais** | Criação, vinculação de clientes, controle de status (Emitida / Pendente / Cancelada) e competência |
| 📊 **Dashboard** | Visão geral com KPIs de clientes, NFs emitidas, pendentes e receita total; gráfico histórico mensal |
| 🔒 **Isolamento de Dados** | Cada empresa opera em uma base de dados própria, sem compartilhamento de informações |
| 🔑 **Autenticação** | Cadastro e login por empresa (CNPJ + senha), com sessão isolada por tenant |

---

## Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    EMITIS SaaS                      │
│                                                     │
│  ┌─────────────┐        ┌────────────────────────┐  │
│  │  Frontend   │ ──────▶│       Backend API      │  │
│  │  React +    │        │   FastAPI + Python      │  │
│  │ TypeScript  │        └────────────┬───────────┘  │
│  └─────────────┘                     │               │
│                          ┌───────────▼───────────┐  │
│                          │    banco_master.db     │  │
│                          │  (Tenants cadastrados) │  │
│                          └───────────┬───────────┘  │
│                                      │               │
│              ┌───────────────────────┼────────────┐  │
│              │                       │            │  │
│     ┌────────▼──────┐    ┌───────────▼───────┐   │  │
│     │ tenant_A.db   │    │  tenant_B.db      │   │  │
│     │ (Empresa A)   │    │  (Empresa B)      │   │  │
│     └───────────────┘    └───────────────────┘   │  │
└─────────────────────────────────────────────────────┘
```

### Banco Master

Armazena os **metadados de cada empresa assinante**. Não contém dados fiscais.

```sql
CREATE TABLE tenants (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_empresa TEXT    NOT NULL,
    cnpj         TEXT    UNIQUE NOT NULL,
    nome_banco   TEXT    NOT NULL   -- nome do arquivo .db isolado do tenant
);
```

### Banco Tenant *(por empresa)*

Cada empresa possui seu próprio banco de dados com as tabelas de **clientes** e **notas fiscais**, sem nenhum dado compartilhado com outros tenants.

---

## Estrutura do Projeto

```text
Emitis/
│
├── emitis-backend/                  # Backend Python
│   └── app/
│       └── db/
│           ├── banco_master.py      # Criação da base central (Master)
│           └── insert.py            # Scripts de inserção de dados
│
├── emitis-frontend/                 # Frontend React + TypeScript
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── AppLayout.tsx    # Wrapper de layout com guard de autenticação
│   │   │   │   ├── Header.tsx       # Cabeçalho da aplicação
│   │   │   │   └── Sidebar.tsx      # Navegação lateral
│   │   │   └── ui/
│   │   │       └── Toast.tsx        # Sistema de notificações
│   │   ├── hooks/
│   │   │   └── useAuth.ts           # Context e hook de autenticação
│   │   ├── pages/
│   │   │   ├── Login.tsx            # Tela de login
│   │   │   ├── Cadastro.tsx         # Cadastro de nova empresa
│   │   │   ├── Dashboard.tsx        # Painel principal com KPIs e gráficos
│   │   │   ├── Clientes.tsx         # CRUD de clientes
│   │   │   ├── NotasFiscais.tsx     # CRUD de notas fiscais
│   │   │   └── Configuracoes.tsx    # Configurações do tenant
│   │   ├── services/
│   │   │   ├── auth.ts              # Serviço de autenticação
│   │   │   ├── clientes.ts          # Serviço de clientes
│   │   │   └── notasFiscais.ts      # Serviço de notas fiscais
│   │   ├── types/
│   │   │   └── index.ts             # Interfaces TypeScript
│   │   ├── App.tsx                  # Roteamento e providers
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Design system global
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── banco_master.db                  # Base de dados central (dev)
└── README.md
```

---

## Stack de Tecnologias

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Python | 3.14+ | Linguagem principal |
| FastAPI | Em breve | Framework web e API REST |
| SQLAlchemy | Em breve | ORM e gerenciamento de sessões |
| SQLite3 | — | Banco de dados em desenvolvimento |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | Framework de interface |
| TypeScript | 5 | Tipagem estática |
| Vite | 8 | Bundler e dev server |
| React Router | 7 | Roteamento SPA |
| Recharts | — | Gráficos do dashboard |
| Lucide React | — | Ícones |

---

## Como Rodar

### Pré-requisitos

- **Python** 3.14+
- **Node.js** 18+
- **npm** 9+

### Backend

```bash
# 1. Crie e ative o ambiente virtual
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/macOS

# 2. Entre na pasta do backend
cd emitis-backend

# 3. Crie o banco master (primeira vez)
python app/db/banco_master.py

# 4. (Futuro) Instale as dependências e inicie a API
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
# 1. Entre na pasta do frontend
cd emitis-frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em **http://localhost:5173**

> **Nota:** Enquanto a API FastAPI não está disponível, o frontend opera com dados persistidos localmente no navegador (localStorage). A camada de serviços (`src/services/`) está estruturada para substituição direta por chamadas HTTP reais.

---

## Fluxo de Uso

```
1. Acesse http://localhost:5173
        │
        ▼
2. Clique em "Cadastre sua empresa"
   → Preencha: Nome, CNPJ, e-mail, telefone, senha
        │
        ▼
3. Você será redirecionado ao Dashboard
        │
        ├──▶ Clientes    → Cadastre os tomadores de serviço
        │
        ├──▶ Notas Fiscais → Crie NFs vinculadas aos clientes
        │                    Gerencie status: Pendente → Emitida
        │
        └──▶ Dashboard   → Acompanhe KPIs e histórico mensal
```

---

## Integração com a API *(Futura)*

Os serviços do frontend estão organizados em `src/services/` com a mesma interface que será usada com a API real. Para conectar ao backend FastAPI, substitua as funções de cada arquivo:

```typescript
// Exemplo: src/services/clientes.ts

// Atual (localStorage)
async getAll(): Promise<Cliente[]> {
  return JSON.parse(localStorage.getItem('emitis_clientes') || '[]');
}

// Após integração com a API
async getAll(): Promise<Cliente[]> {
  const res = await fetch('/api/clientes', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
}
```

---

## Roadmap

- [x] Modelagem do banco de dados Master (SQLite3)
- [x] Script de criação da base Tenant
- [x] Frontend — Autenticação (Login e Cadastro)
- [x] Frontend — Dashboard com KPIs e gráficos
- [x] Frontend — CRUD de Clientes
- [x] Frontend — CRUD de Notas Fiscais
- [x] Frontend — Configurações do Tenant
- [ ] API REST com FastAPI
- [ ] Modelo ORM com SQLAlchemy (Tenant + Master)
- [ ] Autenticação JWT no backend
- [ ] Integração frontend ↔ API
- [ ] Deploy (Docker / Railway / VPS)

---

## Licença

Este projeto foi desenvolvido para fins de estudo e aprendizado.
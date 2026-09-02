// ==========================================
// Emitis — TypeScript Types
// ==========================================

export interface Tenant {
  id: number;
  nome_empresa: string;
  cnpj: string;
  nome_banco: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  plano?: 'basico' | 'pro' | 'enterprise';
  createdAt?: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  uf: string;
  tipo: 'PF' | 'PJ';
  createdAt: string;
}

export type StatusNF = 'emitida' | 'pendente' | 'cancelada';

export interface NotaFiscal {
  id: number;
  numero: string;
  cliente_id: number;
  cliente_nome: string;
  valor: number;
  descricao: string;
  status: StatusNF;
  data_emissao: string;
  data_vencimento?: string;
  competencia?: string;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  tenant: Tenant | null;
}

export interface LoginCredentials {
  cnpj: string;
  senha: string;
}

export interface CadastroData {
  nome_empresa: string;
  cnpj: string;
  email: string;
  telefone: string;
  senha: string;
  confirmar_senha: string;
}

export interface ChartData {
  mes: string;
  emitidas: number;
  valor: number;
}

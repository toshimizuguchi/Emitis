// ==========================================
// Emitis — Auth Service (Mock sem dados fictícios)
// ==========================================
import type { Tenant, LoginCredentials, CadastroData } from '../types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ tenant: Tenant; token: string }> {
    await delay(800);
    if (!credentials.cnpj || !credentials.senha) {
      throw new Error('CNPJ e senha são obrigatórios.');
    }

    // Verifica se há uma conta cadastrada com esse CNPJ
    const saved = localStorage.getItem('emitis_tenant');
    if (saved) {
      const tenant: Tenant = JSON.parse(saved);
      const savedPass = localStorage.getItem('emitis_senha');
      if (tenant.cnpj === credentials.cnpj && savedPass === credentials.senha) {
        const token = 'emitis-token-' + Date.now();
        localStorage.setItem('emitis_token', token);
        return { tenant, token };
      }
    }

    throw new Error('CNPJ ou senha incorretos. Verifique e tente novamente.');
  },

  async cadastro(data: CadastroData): Promise<{ tenant: Tenant; token: string }> {
    await delay(1000);
    if (data.senha !== data.confirmar_senha) {
      throw new Error('As senhas não coincidem.');
    }
    if (data.senha.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    const newTenant: Tenant = {
      id: Date.now(),
      nome_empresa: data.nome_empresa,
      cnpj: data.cnpj,
      nome_banco: data.nome_empresa.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
      email: data.email,
      telefone: data.telefone,
      plano: 'basico',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const token = 'emitis-token-' + Date.now();
    localStorage.setItem('emitis_token', token);
    localStorage.setItem('emitis_tenant', JSON.stringify(newTenant));
    localStorage.setItem('emitis_senha', data.senha);
    return { tenant: newTenant, token };
  },

  logout(): void {
    localStorage.removeItem('emitis_token');
  },

  getCurrentTenant(): Tenant | null {
    if (!localStorage.getItem('emitis_token')) return null;
    const raw = localStorage.getItem('emitis_tenant');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('emitis_token');
  },
};

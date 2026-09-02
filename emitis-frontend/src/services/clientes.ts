// ==========================================
// Emitis — Clientes Service (sem dados fictícios)
// ==========================================
import type { Cliente } from '../types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const STORAGE_KEY = 'emitis_clientes';

function load(): Cliente[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save(clientes: Cliente[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
}

function nextId(clientes: Cliente[]): number {
  return clientes.length > 0 ? Math.max(...clientes.map((c) => c.id)) + 1 : 1;
}

export const clientesService = {
  async getAll(): Promise<Cliente[]> {
    await delay(200);
    return load();
  },

  async getById(id: number): Promise<Cliente | undefined> {
    await delay(100);
    return load().find((c) => c.id === id);
  },

  async create(data: Omit<Cliente, 'id' | 'createdAt'>): Promise<Cliente> {
    await delay(400);
    const clientes = load();
    const newCliente: Cliente = {
      ...data,
      id: nextId(clientes),
      createdAt: new Date().toISOString().split('T')[0],
    };
    save([...clientes, newCliente]);
    return newCliente;
  },

  async update(id: number, data: Partial<Omit<Cliente, 'id' | 'createdAt'>>): Promise<Cliente> {
    await delay(400);
    const clientes = load();
    const idx = clientes.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Cliente não encontrado.');
    clientes[idx] = { ...clientes[idx], ...data };
    save(clientes);
    return clientes[idx];
  },

  async delete(id: number): Promise<void> {
    await delay(300);
    const clientes = load().filter((c) => c.id !== id);
    save(clientes);
  },
};

// ==========================================
// Emitis — Notas Fiscais Service (sem dados fictícios)
// ==========================================
import type { NotaFiscal, StatusNF, ChartData } from '../types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const STORAGE_KEY = 'emitis_notas_fiscais';
const COUNTER_KEY = 'emitis_nf_counter';

function load(): NotaFiscal[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function save(nfs: NotaFiscal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nfs));
}

function nextCounter(): number {
  const current = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
  const next = current + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return next;
}

function buildChartData(nfs: NotaFiscal[]): ChartData[] {
  const now = new Date();
  const months: ChartData[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString('pt-BR', { month: 'short' });


    const monthNFs = nfs.filter((nf) => {
      const emissao = new Date(nf.data_emissao + 'T00:00:00');
      return (
        emissao.getMonth() === d.getMonth() &&
        emissao.getFullYear() === d.getFullYear() &&
        nf.status !== 'cancelada'
      );
    });

    months.push({
      mes: label.replace('.', ''),
      emitidas: monthNFs.length,
      valor: monthNFs.reduce((acc, nf) => acc + nf.valor, 0),
    });
  }

  return months;
}

export const notasFiscaisService = {
  async getAll(): Promise<NotaFiscal[]> {
    await delay(200);
    return [...load()].sort((a, b) => b.id - a.id);
  },

  async getById(id: number): Promise<NotaFiscal | undefined> {
    await delay(100);
    return load().find((nf) => nf.id === id);
  },

  async create(data: Omit<NotaFiscal, 'id' | 'numero'>): Promise<NotaFiscal> {
    await delay(500);
    const nfs = load();
    const counter = nextCounter();
    const year = new Date().getFullYear();
    const newNF: NotaFiscal = {
      ...data,
      id: counter,
      numero: `NF-${year}-${String(counter).padStart(3, '0')}`,
    };
    save([...nfs, newNF]);
    return newNF;
  },

  async updateStatus(id: number, status: StatusNF): Promise<NotaFiscal> {
    await delay(300);
    const nfs = load();
    const idx = nfs.findIndex((nf) => nf.id === id);
    if (idx === -1) throw new Error('Nota fiscal não encontrada.');
    nfs[idx] = { ...nfs[idx], status };
    save(nfs);
    return nfs[idx];
  },

  async delete(id: number): Promise<void> {
    await delay(300);
    save(load().filter((nf) => nf.id !== id));
  },

  getKPIs() {
    const nfs = load();
    const emitidas = nfs.filter((nf) => nf.status === 'emitida').length;
    const pendentes = nfs.filter((nf) => nf.status === 'pendente').length;
    const canceladas = nfs.filter((nf) => nf.status === 'cancelada').length;
    const receita = nfs
      .filter((nf) => nf.status === 'emitida')
      .reduce((acc, nf) => acc + nf.valor, 0);
    return { total: nfs.length, emitidas, pendentes, canceladas, receita };
  },

  getChartData(): ChartData[] {
    return buildChartData(load());
  },

  getRecent(limit = 5): NotaFiscal[] {
    return [...load()]
      .sort((a, b) => new Date(b.data_emissao).getTime() - new Date(a.data_emissao).getTime())
      .slice(0, limit);
  },
};

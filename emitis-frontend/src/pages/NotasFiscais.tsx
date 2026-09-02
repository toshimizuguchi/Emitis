// ==========================================
// Emitis — Notas Fiscais Page (CRUD completo)
// ==========================================
import React, { useEffect, useState } from 'react';
import { Search, Plus, X, FileText, AlertTriangle, CheckCircle2, Clock, XCircle, ChevronDown } from 'lucide-react';
import { notasFiscaisService } from '../services/notasFiscais';
import { clientesService } from '../services/clientes';
import { useToast } from '../components/ui/Toast';
import type { NotaFiscal, StatusNF, Cliente } from '../types';

type FilterStatus = 'todos' | StatusNF;

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const STATUS_CONFIG: Record<StatusNF, { label: string; badge: string; icon: React.ReactElement }> = {
  emitida: { label: 'Emitida', badge: 'badge-success', icon: <CheckCircle2 size={12} /> },
  pendente: { label: 'Pendente', badge: 'badge-warning', icon: <Clock size={12} /> },
  cancelada: { label: 'Cancelada', badge: 'badge-danger', icon: <XCircle size={12} /> },
};

export function NotasFiscaisPage() {
  const { showToast } = useToast();
  const [nfs, setNFs] = useState<NotaFiscal[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<NotaFiscal | null>(null);
  const [statusMenuId, setStatusMenuId] = useState<number | null>(null);

  const [form, setForm] = useState({
    cliente_id: '',
    cliente_nome: '',
    valor: '',
    descricao: '',
    status: 'pendente' as StatusNF,
    data_emissao: new Date().toISOString().split('T')[0],
    data_vencimento: '',
    competencia: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [nfData, clienteData] = await Promise.all([
        notasFiscaisService.getAll(),
        clientesService.getAll(),
      ]);
      setNFs(nfData);
      setClientes(clienteData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Close status menu on outside click
  useEffect(() => {
    const handler = () => setStatusMenuId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const filtered = nfs.filter((nf) => {
    const matchSearch =
      nf.numero.toLowerCase().includes(search.toLowerCase()) ||
      nf.cliente_nome.toLowerCase().includes(search.toLowerCase()) ||
      nf.descricao.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || nf.status === filter;
    return matchSearch && matchFilter;
  });

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const c = clientes.find((c) => c.id === Number(e.target.value));
    setForm((prev) => ({ ...prev, cliente_id: e.target.value, cliente_nome: c?.nome || '' }));
  };

  const handleSave = async () => {
    if (!form.cliente_id || !form.valor || !form.descricao) {
      showToast('Preencha os campos obrigatórios.', 'error');
      return;
    }
    setSaving(true);
    try {
      await notasFiscaisService.create({
        cliente_id: Number(form.cliente_id),
        cliente_nome: form.cliente_nome,
        valor: parseFloat(form.valor.replace(',', '.')),
        descricao: form.descricao,
        status: form.status,
        data_emissao: form.data_emissao,
        data_vencimento: form.data_vencimento || undefined,
        competencia: form.competencia || undefined,
      });
      showToast('Nota fiscal criada com sucesso!');
      setModalOpen(false);
      load();
    } catch {
      showToast('Erro ao criar nota fiscal.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeStatus = async (id: number, status: StatusNF) => {
    try {
      await notasFiscaisService.updateStatus(id, status);
      showToast(`Status alterado para "${STATUS_CONFIG[status].label}".`);
      setStatusMenuId(null);
      load();
    } catch {
      showToast('Erro ao alterar status.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await notasFiscaisService.delete(deleteModal.id);
      showToast('Nota fiscal removida.');
      setDeleteModal(null);
      load();
    } catch {
      showToast('Erro ao remover NF.', 'error');
    }
  };

  const totalFiltered = filtered.reduce((acc, nf) => acc + (nf.status !== 'cancelada' ? nf.valor : 0), 0);

  return (
    <div className="animate-slideup">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notas Fiscais</h1>
          <p className="page-subtitle">Controle e emissão de notas fiscais</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)} id="add-nf-btn">
          <Plus size={16} /> Nova Nota Fiscal
        </button>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['todos', 'emitida', 'pendente', 'cancelada'] as FilterStatus[]).map((s) => {
          const count = s === 'todos' ? nfs.length : nfs.filter((nf) => nf.status === s).length;
          const isActive = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              id={`filter-${s}`}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: isActive ? 'var(--clr-primary)' : 'var(--clr-border)',
                background: isActive ? 'rgba(99,102,241,0.12)' : 'var(--clr-surface)',
                color: isActive ? 'var(--clr-primary-light)' : 'var(--clr-text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {s === 'todos' ? 'Todas' : STATUS_CONFIG[s].label}
              <span style={{
                background: isActive ? 'rgba(99,102,241,0.2)' : 'var(--clr-surface-2)',
                padding: '1px 7px',
                borderRadius: 100,
                fontSize: '0.75rem',
              }}>
                {count}
              </span>
            </button>
          );
        })}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--clr-text-muted)' }}>Total filtrado:</span>
          <span style={{ fontWeight: 700, color: 'var(--clr-success)' }}>{fmt(totalFiltered)}</span>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por número, cliente ou serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="nf-search"
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
            {filtered.length} nota{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="loading-overlay"><span className="loading-spinner" style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: 'var(--clr-primary)', width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data Emissão</th>
                <th>Competência</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="table-empty">
                      <FileText size={32} style={{ margin: '0 auto 0.75rem' }} />
                      <p>Nenhuma nota fiscal encontrada.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((nf) => {
                  const sc = STATUS_CONFIG[nf.status];
                  return (
                    <tr key={nf.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-primary-light)' }}>
                        {nf.numero}
                      </td>
                      <td style={{ fontWeight: 500 }}>{nf.cliente_nome}</td>
                      <td style={{ color: 'var(--clr-text-secondary)', maxWidth: 200 }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {nf.descricao}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: nf.status === 'cancelada' ? 'var(--clr-text-muted)' : 'var(--clr-text)' }}>
                        {fmt(nf.valor)}
                      </td>
                      <td style={{ color: 'var(--clr-text-secondary)', fontSize: '0.82rem' }}>
                        {new Date(nf.data_emissao + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ color: 'var(--clr-text-muted)', fontSize: '0.82rem' }}>
                        {nf.competencia || '—'}
                      </td>
                      <td>
                        {/* Status dropdown */}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            className={`badge ${sc.badge}`}
                            onClick={(e) => { e.stopPropagation(); setStatusMenuId(statusMenuId === nf.id ? null : nf.id); }}
                            id={`status-btn-${nf.id}`}
                            style={{ cursor: 'pointer', border: 'none', gap: 5 }}
                          >
                            {sc.label}
                            <ChevronDown size={10} />
                          </button>
                          {statusMenuId === nf.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                position: 'absolute', top: '110%', left: 0, zIndex: 200,
                                background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)',
                                borderRadius: 'var(--radius-sm)', minWidth: 130, padding: '0.25rem',
                                boxShadow: 'var(--shadow-lg)',
                              }}
                            >
                              {(['emitida', 'pendente', 'cancelada'] as StatusNF[]).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleChangeStatus(nf.id, s)}
                                  id={`set-status-${nf.id}-${s}`}
                                  style={{
                                    width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: nf.status === s ? 'var(--clr-primary-light)' : 'var(--clr-text-secondary)',
                                    fontSize: '0.82rem', borderRadius: 4,
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    fontWeight: nf.status === s ? 600 : 400,
                                  }}
                                >
                                  {STATUS_CONFIG[s].icon}
                                  {STATUS_CONFIG[s].label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={() => setDeleteModal(nf)}
                            title="Excluir"
                            id={`delete-nf-${nf.id}`}
                            style={{ color: 'var(--clr-danger)' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal modal-lg" id="nf-modal">
            <div className="modal-header">
              <h2 className="modal-title">Nova Nota Fiscal</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)} id="close-nf-modal"><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                {/* Cliente */}
                <div className="form-group col-span-2">
                  <label className="form-label" htmlFor="nf-cliente">Cliente *</label>
                  <select id="nf-cliente" className="form-select" value={form.cliente_id} onChange={handleClienteChange} required>
                    <option value="">Selecione o cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome} — {c.cpf_cnpj}</option>
                    ))}
                  </select>
                </div>

                {/* Descrição */}
                <div className="form-group col-span-2">
                  <label className="form-label" htmlFor="nf-descricao">Descrição do Serviço/Produto *</label>
                  <input id="nf-descricao" type="text" className="form-input" placeholder="Ex: Desenvolvimento de sistema web" value={form.descricao} onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))} required />
                </div>

                {/* Valor */}
                <div className="form-group">
                  <label className="form-label" htmlFor="nf-valor">Valor (R$) *</label>
                  <input id="nf-valor" type="number" className="form-input" placeholder="0,00" min="0" step="0.01" value={form.valor} onChange={(e) => setForm((p) => ({ ...p, valor: e.target.value }))} required />
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="form-label" htmlFor="nf-status">Status</label>
                  <select id="nf-status" className="form-select" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as StatusNF }))}>
                    <option value="pendente">Pendente</option>
                    <option value="emitida">Emitida</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                {/* Data Emissão */}
                <div className="form-group">
                  <label className="form-label" htmlFor="nf-emissao">Data de Emissão</label>
                  <input id="nf-emissao" type="date" className="form-input" value={form.data_emissao} onChange={(e) => setForm((p) => ({ ...p, data_emissao: e.target.value }))} />
                </div>

                {/* Data Vencimento */}
                <div className="form-group">
                  <label className="form-label" htmlFor="nf-vencimento">Data de Vencimento</label>
                  <input id="nf-vencimento" type="date" className="form-input" value={form.data_vencimento} onChange={(e) => setForm((p) => ({ ...p, data_vencimento: e.target.value }))} />
                </div>

                {/* Competência */}
                <div className="form-group">
                  <label className="form-label" htmlFor="nf-competencia">Competência</label>
                  <input id="nf-competencia" type="text" className="form-input" placeholder="MM/AAAA" value={form.competencia} onChange={(e) => setForm((p) => ({ ...p, competencia: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)} id="cancel-nf-btn">Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="save-nf-btn">
                {saving ? <><span className="loading-spinner" /> Criando...</> : <><FileText size={15} /> Criar Nota Fiscal</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteModal(null)}>
          <div className="modal" style={{ maxWidth: 420 }} id="delete-nf-modal">
            <div className="modal-body" style={{ paddingTop: '2rem' }}>
              <div className="confirm-dialog">
                <div className="confirm-icon"><AlertTriangle size={28} /></div>
                <div className="confirm-title">Remover Nota Fiscal</div>
                <div className="confirm-desc">
                  Tem certeza que deseja remover a <strong>{deleteModal.numero}</strong>? Esta ação não pode ser desfeita.
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteModal(null)} id="cancel-delete-nf-btn">Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete} id="confirm-delete-nf-btn">Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

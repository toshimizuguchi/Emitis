// ==========================================
// Emitis — Clientes Page (CRUD completo)
// ==========================================
import { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, User, Building2, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { clientesService } from '../services/clientes';
import { useToast } from '../components/ui/Toast';
import type { Cliente } from '../types';

type FormData = Omit<Cliente, 'id' | 'createdAt'>;

const EMPTY_FORM: FormData = {
  nome: '', cpf_cnpj: '', email: '', telefone: '',
  endereco: '', cidade: '', uf: '', tipo: 'PJ',
};

const UFs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export function ClientesPage() {
  const { showToast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await clientesService.getAll();
      setClientes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.cpf_cnpj.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (c: Cliente) => {
    setEditingId(c.id);
    setForm({ nome: c.nome, cpf_cnpj: c.cpf_cnpj, email: c.email, telefone: c.telefone, endereco: c.endereco, cidade: c.cidade, uf: c.uf, tipo: c.tipo });
    setModalOpen(true);
  };

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.nome || !form.cpf_cnpj || !form.email) {
      showToast('Preencha os campos obrigatórios.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingId !== null) {
        await clientesService.update(editingId, form);
        showToast('Cliente atualizado com sucesso!');
      } else {
        await clientesService.create(form);
        showToast('Cliente cadastrado com sucesso!');
      }
      setModalOpen(false);
      load();
    } catch {
      showToast('Erro ao salvar cliente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await clientesService.delete(deleteModal.id);
      showToast('Cliente removido.');
      setDeleteModal(null);
      load();
    } catch {
      showToast('Erro ao remover cliente.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-slideup">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Gerencie seus tomadores de serviço</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="add-cliente-btn">
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por nome, CNPJ ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="clientes-search"
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
            {filtered.length} cliente{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="loading-overlay"><span className="loading-spinner" style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: 'var(--clr-primary)', width: 32, height: 32, borderWidth: 3 }} /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Tipo</th>
                <th>Cidade</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="table-empty">
                      <User size={32} style={{ margin: '0 auto 0.75rem' }} />
                      <p>Nenhum cliente encontrado.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'rgba(99,102,241,0.15)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 700, color: 'var(--clr-primary-light)',
                          flexShrink: 0,
                        }}>
                          {c.nome.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                        </div>
                        <span style={{ fontWeight: 500 }}>{c.nome}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--clr-text-secondary)' }}>{c.cpf_cnpj}</td>
                    <td style={{ color: 'var(--clr-text-secondary)' }}>{c.email}</td>
                    <td style={{ color: 'var(--clr-text-secondary)' }}>{c.telefone}</td>
                    <td>
                      <span className={`badge ${c.tipo === 'PJ' ? 'badge-primary' : 'badge-info'}`}>
                        {c.tipo}
                      </span>
                    </td>
                    <td style={{ color: 'var(--clr-text-secondary)' }}>{c.cidade}/{c.uf}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          onClick={() => openEdit(c)}
                          title="Editar"
                          id={`edit-cliente-${c.id}`}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          onClick={() => setDeleteModal(c)}
                          title="Excluir"
                          id={`delete-cliente-${c.id}`}
                          style={{ color: 'var(--clr-danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal modal-lg" id="cliente-modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              <button className="modal-close" onClick={() => setModalOpen(false)} id="close-cliente-modal">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              {/* Tipo */}
              <div className="form-group">
                <label className="form-label">Tipo de Pessoa</label>
                <div className="filter-tabs" style={{ width: 'fit-content' }}>
                  <button className={`filter-tab${form.tipo === 'PJ' ? ' active' : ''}`} onClick={() => setForm((p) => ({ ...p, tipo: 'PJ' }))} id="tipo-pj">Pessoa Jurídica</button>
                  <button className={`filter-tab${form.tipo === 'PF' ? ' active' : ''}`} onClick={() => setForm((p) => ({ ...p, tipo: 'PF' }))} id="tipo-pf">Pessoa Física</button>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group col-span-2">
                  <label className="form-label" htmlFor="c-nome">Nome / Razão Social *</label>
                  <div className="form-input-icon">
                    <Building2 size={16} />
                    <input id="c-nome" type="text" className="form-input" placeholder="Nome completo" value={form.nome} onChange={set('nome')} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="c-cpf-cnpj">{form.tipo === 'PJ' ? 'CNPJ' : 'CPF'} *</label>
                  <input id="c-cpf-cnpj" type="text" className="form-input" placeholder={form.tipo === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'} value={form.cpf_cnpj} onChange={set('cpf_cnpj')} required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="c-telefone">Telefone</label>
                  <div className="form-input-icon">
                    <Phone size={16} />
                    <input id="c-telefone" type="text" className="form-input" placeholder="(00) 00000-0000" value={form.telefone} onChange={set('telefone')} />
                  </div>
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label" htmlFor="c-email">E-mail *</label>
                  <div className="form-input-icon">
                    <Mail size={16} />
                    <input id="c-email" type="email" className="form-input" placeholder="email@empresa.com.br" value={form.email} onChange={set('email')} required />
                  </div>
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label" htmlFor="c-endereco">Endereço</label>
                  <div className="form-input-icon">
                    <MapPin size={16} />
                    <input id="c-endereco" type="text" className="form-input" placeholder="Rua, número, bairro" value={form.endereco} onChange={set('endereco')} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="c-cidade">Cidade</label>
                  <input id="c-cidade" type="text" className="form-input" placeholder="São Paulo" value={form.cidade} onChange={set('cidade')} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="c-uf">UF</label>
                  <select id="c-uf" className="form-select" value={form.uf} onChange={set('uf')}>
                    <option value="">Selecione</option>
                    {UFs.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)} id="cancel-cliente-btn">Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="save-cliente-btn">
                {saving ? <><span className="loading-spinner" /> Salvando...</> : editingId ? 'Salvar Alterações' : 'Cadastrar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteModal(null)}>
          <div className="modal" style={{ maxWidth: 420 }} id="delete-modal">
            <div className="modal-body" style={{ paddingTop: '2rem' }}>
              <div className="confirm-dialog">
                <div className="confirm-icon"><AlertTriangle size={28} /></div>
                <div className="confirm-title">Remover Cliente</div>
                <div className="confirm-desc">
                  Tem certeza que deseja remover <strong>{deleteModal.nome}</strong>? Esta ação não pode ser desfeita.
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteModal(null)} id="cancel-delete-btn">Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting} id="confirm-delete-btn">
                {deleting ? <><span className="loading-spinner" /> Removendo...</> : 'Remover Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

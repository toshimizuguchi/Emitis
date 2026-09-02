// ==========================================
// Emitis — Configurações Page
// ==========================================
import { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Save, Shield, Database, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

export function ConfiguracoesPage() {
  const { tenant } = useAuth();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome_empresa: tenant?.nome_empresa || '',
    cnpj: tenant?.cnpj || '',
    email: tenant?.email || '',
    telefone: tenant?.telefone || '',
    endereco: tenant?.endereco || '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    showToast('Configurações salvas com sucesso!');
  };

  const planColor = {
    basico: 'var(--clr-info)',
    pro: 'var(--clr-primary-light)',
    enterprise: 'var(--clr-accent)',
  };

  return (
    <div className="animate-slideup">
      <div className="page-header">
        <div>
          <h1 className="page-title">Configurações</h1>
          <p className="page-subtitle">Gerencie as informações da sua empresa</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Main Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Dados da Empresa */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-primary-light)' }}>
                <Building2 size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Dados da Empresa</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>Informações básicas do seu tenant</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="cfg-nome">Nome da Empresa</label>
                <div className="form-input-icon">
                  <Building2 size={16} />
                  <input id="cfg-nome" type="text" className="form-input" value={form.nome_empresa} onChange={set('nome_empresa')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cfg-cnpj">CNPJ</label>
                <input id="cfg-cnpj" type="text" className="form-input" value={form.cnpj} onChange={set('cnpj')} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                <span className="form-error" style={{ color: 'var(--clr-text-muted)' }}>O CNPJ não pode ser alterado.</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cfg-telefone">Telefone</label>
                <div className="form-input-icon">
                  <Phone size={16} />
                  <input id="cfg-telefone" type="text" className="form-input" value={form.telefone} onChange={set('telefone')} />
                </div>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="cfg-email">E-mail</label>
                <div className="form-input-icon">
                  <Mail size={16} />
                  <input id="cfg-email" type="email" className="form-input" value={form.email} onChange={set('email')} />
                </div>
              </div>

              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="cfg-endereco">Endereço</label>
                <div className="form-input-icon">
                  <MapPin size={16} />
                  <input id="cfg-endereco" type="text" className="form-input" value={form.endereco} onChange={set('endereco')} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="save-config-btn">
                {saving ? <><span className="loading-spinner" /> Salvando...</> : <><Save size={15} /> Salvar Alterações</>}
              </button>
            </div>
          </div>

          {/* Segurança */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-success)' }}>
                <Shield size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Segurança</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>Gerencie suas credenciais de acesso</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="cfg-senha-atual">Senha Atual</label>
                <input id="cfg-senha-atual" type="password" className="form-input" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cfg-senha-nova">Nova Senha</label>
                <input id="cfg-senha-nova" type="password" className="form-input" placeholder="Mínimo 6 caracteres" />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" id="change-password-btn">Alterar Senha</button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tenant Info */}
          <div className="card">
            <div style={{ textAlign: 'center', padding: '0.5rem 0 1.25rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-accent))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 700, color: '#fff',
                margin: '0 auto 1rem',
              }}>
                {tenant?.nome_empresa?.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </div>
              <h3 style={{ fontWeight: 700 }}>{tenant?.nome_empresa}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>{tenant?.cnpj}</p>
            </div>

            <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: <Zap size={14} />, label: 'Plano', value: tenant?.plano ? { basico: 'Básico', pro: 'Pro', enterprise: 'Enterprise' }[tenant.plano] : '—', color: planColor[tenant?.plano || 'basico'] },
                { icon: <Database size={14} />, label: 'Banco de Dados', value: tenant?.nome_banco, color: 'var(--clr-text-secondary)' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--clr-text-muted)' }}>
                    {item.icon} {item.label}
                  </span>
                  <span style={{ fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Isolation Info */}
          <div className="card" style={{ borderColor: 'rgba(34,211,238,0.15)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Shield size={18} style={{ color: 'var(--clr-accent)', marginTop: 2, flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>Isolamento de Dados</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-secondary)', lineHeight: 1.6 }}>
                  Seus dados são armazenados em um banco de dados exclusivo e isolado, garantindo total privacidade e segurança fiscal.
                </p>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--clr-success)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-success)' }} />
                  Banco isolado ativo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

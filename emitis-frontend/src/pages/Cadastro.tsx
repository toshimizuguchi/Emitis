// ==========================================
// Emitis — Cadastro Page
// ==========================================
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { CadastroData } from '../types';

export function CadastroPage() {
  const [form, setForm] = useState<CadastroData>({
    nome_empresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    senha: '',
    confirmar_senha: '',
  });
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState('');
  const { cadastro, isLoading } = useAuth();
  const navigate = useNavigate();

  const formatCNPJ = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 14);
    return nums
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    return nums
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const set = (field: keyof CadastroData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (field === 'cnpj') val = formatCNPJ(val);
    if (field === 'telefone') val = formatPhone(val);
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    try {
      await cadastro(form);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow auth-bg-glow-1" />
      <div className="auth-bg-glow auth-bg-glow-2" />

      <div className="auth-card" style={{ maxWidth: 520 }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">E</div>
          <span className="auth-logo-name">Emitis</span>
        </div>

        <h1 className="auth-heading">Cadastre sua empresa</h1>
        <p className="auth-subheading">
          Comece a emitir notas fiscais em minutos.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} id="cadastro-form">
          <div className="form-grid">
            {/* Nome da empresa */}
            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="nome_empresa">Nome da Empresa</label>
              <div className="form-input-icon">
                <Building2 size={16} />
                <input
                  id="nome_empresa"
                  type="text"
                  className="form-input"
                  placeholder="Acme Tecnologia Ltda."
                  value={form.nome_empresa}
                  onChange={set('nome_empresa')}
                  required
                />
              </div>
            </div>

            {/* CNPJ */}
            <div className="form-group">
              <label className="form-label" htmlFor="cnpj-cadastro">CNPJ</label>
              <input
                id="cnpj-cadastro"
                type="text"
                className="form-input"
                placeholder="00.000.000/0001-00"
                value={form.cnpj}
                onChange={set('cnpj')}
                required
              />
            </div>

            {/* Telefone */}
            <div className="form-group">
              <label className="form-label" htmlFor="telefone-cadastro">Telefone</label>
              <div className="form-input-icon">
                <Phone size={16} />
                <input
                  id="telefone-cadastro"
                  type="text"
                  className="form-input"
                  placeholder="(00) 00000-0000"
                  value={form.telefone}
                  onChange={set('telefone')}
                />
              </div>
            </div>

            {/* E-mail */}
            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="email-cadastro">E-mail</label>
              <div className="form-input-icon">
                <Mail size={16} />
                <input
                  id="email-cadastro"
                  type="email"
                  className="form-input"
                  placeholder="contato@empresa.com.br"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div className="form-group">
              <label className="form-label" htmlFor="senha-cadastro">Senha</label>
              <div className="form-input-icon" style={{ position: 'relative' }}>
                <Lock size={16} />
                <input
                  id="senha-cadastro"
                  type={showSenha ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={set('senha')}
                  required
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  style={{
                    position: 'absolute', right: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none', border: 'none',
                    color: 'var(--clr-text-muted)', cursor: 'pointer', display: 'flex',
                  }}
                  id="toggle-senha-btn"
                >
                  {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmar-senha">Confirmar Senha</label>
              <input
                id="confirmar-senha"
                type={showSenha ? 'text' : 'password'}
                className="form-input"
                placeholder="Repita a senha"
                value={form.confirmar_senha}
                onChange={set('confirmar_senha')}
                required
              />
            </div>
          </div>

          {error && (
            <div className="form-error" style={{ padding: '0.5rem 0.75rem', background: 'var(--clr-danger-bg)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
            id="cadastro-submit-btn"
            style={{ justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {isLoading ? (
              <><span className="loading-spinner" /> Criando conta...</>
            ) : (
              <>Criar conta <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="auth-link">
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--clr-text-secondary)' }} id="link-login">
            <ArrowLeft size={14} /> Já tenho conta
          </Link>
        </div>
      </div>
    </div>
  );
}

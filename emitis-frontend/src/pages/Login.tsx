// ==========================================
// Emitis — Login Page
// ==========================================
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Building2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const formatCNPJ = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 14);
    return nums
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ cnpj, senha });
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow auth-bg-glow-1" />
      <div className="auth-bg-glow auth-bg-glow-2" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">E</div>
          <span className="auth-logo-name">Emitis</span>
        </div>

        <h1 className="auth-heading">Bem-vindo de volta</h1>
        <p className="auth-subheading">
          Acesse sua conta e gerencie suas notas fiscais.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          {/* CNPJ */}
          <div className="form-group">
            <label className="form-label" htmlFor="cnpj">CNPJ da Empresa</label>
            <div className="form-input-icon">
              <Building2 size={16} />
              <input
                id="cnpj"
                type="text"
                className="form-input"
                placeholder="00.000.000/0001-00"
                value={cnpj}
                onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="form-group">
            <label className="form-label" htmlFor="senha">Senha</label>
            <div className="form-input-icon" style={{ position: 'relative' }}>
              <Lock size={16} />
              <input
                id="senha"
                type={showSenha ? 'text' : 'password'}
                className="form-input"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                style={{ paddingRight: '2.75rem' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none', border: 'none',
                  color: 'var(--clr-text-muted)', cursor: 'pointer', display: 'flex',
                }}
                id="toggle-password-btn"
              >
                {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="form-error" style={{
              padding: '0.5rem 0.75rem',
              background: 'var(--clr-danger-bg)',
              borderRadius: '6px',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
            id="login-submit-btn"
            style={{ justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {isLoading ? (
              <><span className="loading-spinner" /> Entrando...</>
            ) : (
              <>Entrar <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="auth-link">
          Não tem conta?{' '}
          <Link to="/cadastro" id="link-cadastro">Cadastre sua empresa</Link>
        </div>
      </div>
    </div>
  );
}

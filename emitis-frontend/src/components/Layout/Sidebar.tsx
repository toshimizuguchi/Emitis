// ==========================================
// Emitis — Sidebar Component
// ==========================================
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/notas-fiscais', icon: FileText, label: 'Notas Fiscais' },
];

const bottomItems = [
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  const { tenant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = tenant?.nome_empresa
    ? tenant.nome_empresa.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'EM';

  const planLabel = { basico: 'Plano Básico', pro: 'Plano Pro', enterprise: 'Enterprise' };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">E</div>
        <div>
          <div className="sidebar-logo-text">Emitis</div>
          <div className="sidebar-logo-badge">SaaS Multi-Tenant</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Principal</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}

        <div className="sidebar-nav-label" style={{ marginTop: '1rem' }}>Sistema</div>
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}

        <button
          className="sidebar-nav-item"
          onClick={handleLogout}
          style={{ marginTop: '0.25rem', color: 'var(--clr-danger)', border: 'none', width: '100%', textAlign: 'left', background: 'transparent' }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </nav>

      {/* Tenant Card */}
      <div className="sidebar-footer">
        {tenant && (
          <div className="sidebar-tenant-card">
            <div className="sidebar-tenant-avatar">{initials}</div>
            <div className="sidebar-tenant-info">
              <div className="sidebar-tenant-name" title={tenant.nome_empresa}>
                {tenant.nome_empresa}
              </div>
              <div className="sidebar-tenant-plan">
                <Zap size={10} style={{ display: 'inline', marginRight: 3 }} />
                {planLabel[tenant.plano || 'basico']}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

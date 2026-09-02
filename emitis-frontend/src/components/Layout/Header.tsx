// ==========================================
// Emitis — Header Component
// ==========================================
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { tenant } = useAuth();

  const initials = tenant?.nome_empresa
    ? tenant.nome_empresa.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'EM';

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <div className="header-title">{title}</div>
          {subtitle && <div className="header-breadcrumb">{subtitle}</div>}
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn" title="Buscar" id="header-search-btn">
          <Search size={16} />
        </button>
        <button className="header-btn" title="Notificações" id="header-notifications-btn">
          <Bell size={16} />
        </button>
        <div className="header-avatar" title={tenant?.nome_empresa} id="header-avatar">
          {initials}
        </div>
      </div>
    </header>
  );
}

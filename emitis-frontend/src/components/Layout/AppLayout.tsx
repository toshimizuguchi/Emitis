// ==========================================
// Emitis — App Layout
// ==========================================
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';

interface AppLayoutProps {
  title: string;
  subtitle?: string;
}

export function AppLayout({ title, subtitle }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header title={title} subtitle={subtitle} />
        <main className="app-content animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

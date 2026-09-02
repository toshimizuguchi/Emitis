// ==========================================
// Emitis — App Router
// ==========================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './hooks/useAuth';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/Layout/AppLayout';
import { LoginPage } from './pages/Login';
import { CadastroPage } from './pages/Cadastro';
import { DashboardPage } from './pages/Dashboard';
import { ClientesPage } from './pages/Clientes';
import { NotasFiscaisPage } from './pages/NotasFiscais';
import { ConfiguracoesPage } from './pages/Configuracoes';
import { useState, useEffect, useCallback } from 'react';
import { authService } from './services/auth';
import type { Tenant, LoginCredentials, CadastroData } from './types';

function AppProviders() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = authService.getCurrentTenant();
    if (saved) setTenant(saved);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { tenant } = await authService.login(credentials);
      setTenant(tenant);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cadastro = useCallback(async (data: CadastroData) => {
    setIsLoading(true);
    try {
      const { tenant } = await authService.cadastro(data);
      setTenant(tenant);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setTenant(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ tenant, isAuthenticated: !!tenant, isLoading, login, cadastro, logout }}
    >
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={<AppLayout title="Dashboard" subtitle="Visão geral do seu negócio" />}
            >
              <Route index element={<DashboardPage />} />
            </Route>

            <Route
              path="/clientes"
              element={<AppLayout title="Clientes" subtitle="Gestão de tomadores de serviço" />}
            >
              <Route index element={<ClientesPage />} />
            </Route>

            <Route
              path="/notas-fiscais"
              element={<AppLayout title="Notas Fiscais" subtitle="Controle fiscal da empresa" />}
            >
              <Route index element={<NotasFiscaisPage />} />
            </Route>

            <Route
              path="/configuracoes"
              element={<AppLayout title="Configurações" subtitle="Dados do tenant" />}
            >
              <Route index element={<ConfiguracoesPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthContext.Provider>
  );
}

export default AppProviders;

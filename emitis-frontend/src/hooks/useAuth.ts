// ==========================================
// Emitis — useAuth Hook
// ==========================================
import { useContext, createContext } from 'react';
import type { Tenant, LoginCredentials, CadastroData } from '../types';

export interface AuthContextType {
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  cadastro: (data: CadastroData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthContext.Provider');
  return ctx;
}

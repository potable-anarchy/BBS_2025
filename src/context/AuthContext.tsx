/**
 * Authentication context for managing user state across the application
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserSession } from '../utils/sessionStorage';
import {
  getSession,
  saveSession,
  clearSession,
  hasValidSession,
} from '../utils/sessionStorage';

export const ConnectionStatus = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
} as const;

export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus];

interface AuthContextType {
  session: UserSession | null;
  isAuthenticated: boolean;
  connectionStatus: ConnectionStatus;
  login: (handle: string) => void;
  logout: () => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED
  );

  // Restore session from LocalStorage on mount
  useEffect(() => {
    const existingSession = getSession();
    if (existingSession) {
      setSession(existingSession);
    }
  }, []);

  const login = (handle: string) => {
    const newSession = saveSession(handle);
    setSession(newSession);
  };

  const logout = () => {
    clearSession();
    setSession(null);
    setConnectionStatus(ConnectionStatus.DISCONNECTED);
  };

  const value: AuthContextType = {
    session,
    isAuthenticated: hasValidSession(),
    connectionStatus,
    login,
    logout,
    setConnectionStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useCallback } from 'react';

export type Role = 'admin' | 'user';

export interface AuthUser {
  username: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const USERS: { username: string; password: string; role: Role; name: string }[] = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  { username: 'user', password: 'user123', role: 'user', name: 'John Doe' },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = sessionStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((username: string, password: string): boolean => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      const authUser: AuthUser = { username: found.username, role: found.role, name: found.name };
      setUser(authUser);
      sessionStorage.setItem('auth_user', JSON.stringify(authUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('auth_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

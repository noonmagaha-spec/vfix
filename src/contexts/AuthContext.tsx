/* eslint-disable react-refresh/only-export-components */
// ============================================================
// V-FIX — Authentication Context
// Manages login/logout with localStorage
// ============================================================

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Role } from '../types';

interface AuthUser {
  username: string;
  role: Role;
  canSwitchRoles: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// User credentials database
const users = [
  { username: 'admin-vfix', password: 'Vfix123456', role: 'Admin' as Role, canSwitchRoles: true },
  { username: 'tech01-vfix', password: 'Vfix123456', role: 'Technician' as Role, canSwitchRoles: false },
  { username: 'driver01-vfix', password: 'Vfix123456', role: 'Driver' as Role, canSwitchRoles: false },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Check localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('vfix_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUser(authData);
      } catch (error) {
        localStorage.removeItem('vfix_auth');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const authUser: AuthUser = {
        username: foundUser.username,
        role: foundUser.role,
        canSwitchRoles: foundUser.canSwitchRoles,
      };

      setUser(authUser);
      setIsAuthenticated(true);
      localStorage.setItem('vfix_auth', JSON.stringify(authUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vfix_auth');
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
    }),
    [isAuthenticated, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

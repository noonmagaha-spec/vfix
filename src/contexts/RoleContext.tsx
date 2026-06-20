/* eslint-disable react-refresh/only-export-components */
// ============================================================
// V-FIX — Role Context
// Manages role switching with authentication integration
// ============================================================

import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Role, User } from '../types';
import { mockUsers } from '../data/mockData';
import { useAuth } from './AuthContext';

interface RoleContextType {
  currentRole: Role;
  currentUser: User;
  switchRole: (role: Role) => void;
  allUsers: User[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Default users for each role
const defaultUserByRole: Record<Role, string> = {
  Admin: 'USR-001',
  Technician: 'USR-004',
  Driver: 'USR-007',
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    // Initialize role from authenticated user if available
    return user?.role || 'Admin';
  });

  // Update role when user changes (login/logout)
  React.useEffect(() => {
    if (user) {
      setCurrentRole(user.role);
    }
  }, [user]);

  const currentUser = useMemo(() => {
    const userId = defaultUserByRole[currentRole];
    return mockUsers.find((u) => u.id === userId) || mockUsers[0];
  }, [currentRole]);

  const switchRole = (role: Role) => {
    setCurrentRole(role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, currentUser, switchRole, allUsers: mockUsers }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
};

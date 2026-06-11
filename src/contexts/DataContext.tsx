/* eslint-disable react-refresh/only-export-components */
// ============================================================
// V-FIX — Data Context
// In-memory data store for vehicles, tickets, and users
// ============================================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Vehicle, Ticket, User } from '../types';
import { mockVehicles, mockTickets, mockUsers } from '../data/mockData';

interface DataContextType {
  // Vehicles
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  // Tickets
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;

  // Users
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;

  // Helpers
  getVehicleById: (id: string) => Vehicle | undefined;
  getUserById: (id: string) => User | undefined;
  getTicketsByVehicle: (vehicleId: string) => Ticket[];
  getTicketsByDriver: (driverId: string) => Ticket[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([...mockVehicles]);
  const [tickets, setTickets] = useState<Ticket[]>([...mockTickets]);
  const [users, setUsers] = useState<User[]>([...mockUsers]);

  // ─── Vehicle CRUD ─────────────────────────────────────────
  const addVehicle = useCallback((vehicle: Vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
  }, []);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  // ─── Ticket CRUD ──────────────────────────────────────────
  const addTicket = useCallback((ticket: Ticket) => {
    setTickets((prev) => [...prev, ticket]);
  }, []);

  const updateTicket = useCallback((id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  // ─── User CRUD ────────────────────────────────────────────
  const addUser = useCallback((user: User) => {
    setUsers((prev) => [...prev, user]);
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  }, []);

  // ─── Helpers ──────────────────────────────────────────────
  const getVehicleById = useCallback(
    (id: string) => vehicles.find((v) => v.id === id),
    [vehicles]
  );

  const getUserById = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users]
  );

  const getTicketsByVehicle = useCallback(
    (vehicleId: string) => tickets.filter((t) => t.vehicleId === vehicleId),
    [tickets]
  );

  const getTicketsByDriver = useCallback(
    (driverId: string) => tickets.filter((t) => t.driverId === driverId),
    [tickets]
  );

  return (
    <DataContext.Provider
      value={{
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        tickets,
        addTicket,
        updateTicket,
        users,
        addUser,
        updateUser,
        getVehicleById,
        getUserById,
        getTicketsByVehicle,
        getTicketsByDriver,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

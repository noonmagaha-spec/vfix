// ============================================================
// V-FIX — Type Definitions
// ============================================================

export type Role = 'Admin' | 'Technician' | 'Driver';

export type TicketStatus = 'Pending' | 'In Progress' | 'On Hold' | 'Completed' | 'Closed';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type RepairCategory = 'Engine' | 'Electrical' | 'Tires' | 'Body' | 'Other';

export type VehicleStatus = 'Active' | 'Under Repair' | 'Out of Service';

export type VehicleType = 'Delivery Truck' | 'Passenger Van' | 'Pickup Truck' | 'Motorcycle' | 'Sedan';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  assignedVehicleIds?: string[];
  avatar?: string;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  type?: VehicleType;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
  mileage: number;
  lastServiceDate?: string;
}

export interface StatusChange {
  status: TicketStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface Ticket {
  id: string;
  vehicleId: string;
  driverId: string;
  technicianId?: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  category: RepairCategory;
  status: TicketStatus;
  notes: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusChange[];
  comments: Array<{
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }>;
}

export interface MonthlyCostData {
  month: string;
  vehicleId: string;
  cost: number;
}

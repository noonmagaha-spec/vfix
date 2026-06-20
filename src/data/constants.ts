// ============================================================
// V-FIX — Centralized Thai Constants
// Vehicle types, statuses, categories, and labels
// ============================================================

import type { VehicleType, VehicleStatus, RepairCategory, TicketStatus, UrgencyLevel } from '../types';

// Vehicle Types (Thai)
export const VEHICLE_TYPES = {
  'Delivery Truck': 'รถบรรทุกส่งของ',
  'Passenger Van': 'รถตู้โดยสาร',
  'Pickup Truck': 'รถกระบะ',
  'Motorcycle': 'รถจักรยานยนต์',
} as const;

export const VEHICLE_TYPE_OPTIONS: VehicleType[] = Object.keys(VEHICLE_TYPES) as VehicleType[];

// Vehicle Statuses (Thai)
export const VEHICLE_STATUSES: Record<VehicleStatus, string> = {
  'Active': 'ใช้งานได้',
  'Under Repair': 'อยู่ระหว่างซ่อม',
  'Out of Service': 'ไม่ใช้งาน',
} as const;

export const VEHICLE_STATUS_OPTIONS: VehicleStatus[] = Object.keys(VEHICLE_STATUSES) as VehicleStatus[];

// Ticket Categories (Thai)
export const REPAIR_CATEGORIES: Record<RepairCategory, string> = {
  'Engine': 'เครื่องยนต์',
  'Transmission': 'ระบบส่งกำลัง',
  'Brakes': 'ระบบเบรก',
  'Tires': 'ยาง',
  'Electrical': 'ระบบไฟฟ้า',
  'Air Conditioning': 'แอร์',
  'Oil Change': 'เปลี่ยนน้ำมันเครื่อง',
  'Maintenance': 'บำรุงรักษา',
  'Body': 'ตัวถัง',
  'Glass': 'กระจก',
  'Lighting': 'ไฟ',
  'Fuel System': 'ระบบเชื้อเพลิง',
  'Cooling': 'ระบบระบายความร้อน',
  'Other': 'อื่นๆ',
} as const;

export const REPAIR_CATEGORY_OPTIONS: RepairCategory[] = Object.keys(REPAIR_CATEGORIES) as RepairCategory[];

// Ticket Statuses (Thai)
export const TICKET_STATUSES: Record<TicketStatus, string> = {
  'Pending': 'รอดำเนินการ',
  'In Progress': 'กำลังดำเนินการ',
  'Completed': 'เสร็จสิ้น',
  'Closed': 'ปิดงาน',
  'On Hold': 'รอเบิกอะไหล่',
} as const;

export const TICKET_STATUS_OPTIONS: TicketStatus[] = Object.keys(TICKET_STATUSES) as TicketStatus[];

// Ticket Urgencies (Thai)
export const URGENCY_LEVELS: Record<UrgencyLevel, string> = {
  'Critical': 'สูงที่สุด',
  'High': 'สูง',
  'Medium': 'ปานกลาง',
  'Low': 'ต่ำ',
} as const;

export const URGENCY_LEVEL_OPTIONS: UrgencyLevel[] = Object.keys(URGENCY_LEVELS) as UrgencyLevel[];

// Status Colors
export const STATUS_COLORS = {
  vehicle: {
    'Active': { bg: '#E8F5E9', color: '#2E7D32' },
    'Under Repair': { bg: '#FFF3E0', color: '#E65100' },
    'Out of Service': { bg: '#FFEBEE', color: '#C62828' },
  },
  ticket: {
    'Pending': { bg: '#FFF3E0', color: '#E65100' },
    'In Progress': { bg: '#E3F2FD', color: '#1976D2' },
    'Completed': { bg: '#E8F5E9', color: '#2E7D32' },
    'Closed': { bg: '#ECEFF1', color: '#607D8B' },
    'On Hold': { bg: '#F3E5F5', color: '#7B1FA2' },
  },
  urgency: {
    'Critical': { bg: '#FFEBEE', color: '#C62828' },
    'High': { bg: '#FFF3E0', color: '#E65100' },
    'Medium': { bg: '#FFF8E1', color: '#F57C00' },
    'Low': { bg: '#E8F5E9', color: '#2E7D32' },
  },
} as const;

// Helper function to get Thai label
export const getVehicleTypeLabel = (type: VehicleType): string => VEHICLE_TYPES[type] || type;
export const getVehicleStatusLabel = (status: VehicleStatus): string => VEHICLE_STATUSES[status] || status;
export const getRepairCategoryLabel = (category: RepairCategory): string => REPAIR_CATEGORIES[category] || category;
export const getTicketStatusLabel = (status: TicketStatus): string => TICKET_STATUSES[status] || status;
export const getUrgencyLevelLabel = (urgency: UrgencyLevel): string => URGENCY_LEVELS[urgency] || urgency;

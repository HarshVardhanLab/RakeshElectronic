// Database types for Supabase tables

export type BookingStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type BookingPriority = 'low' | 'medium' | 'high';
export type ProductCategory = 'fans' | 'appliances' | 'accessories' | 'spare-parts';
export type DeviceEntryStatus = 'received' | 'in-repair' | 'ready' | 'delivered' | 'cancelled';
export type WindingType = 'copper' | 'aluminium' | 'other';

export interface Booking {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  device_type: string;
  brand?: string;
  issue_description: string;
  status: BookingStatus;
  priority: BookingPriority;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  technician_name?: string;
  technician_phone?: string;
  scheduled_date?: string;
  completed_date?: string;
  warranty_until?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingInsert {
  customer_name: string;
  phone: string;
  email?: string;
  device_type: string;
  brand?: string;
  issue_description: string;
}

export interface BookingUpdate {
  id: string;
  status?: BookingStatus;
  priority?: BookingPriority;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  technician_name?: string;
  technician_phone?: string;
  scheduled_date?: string;
  completed_date?: string;
  warranty_until?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: ProductCategory;
  brand?: string;
  image_url?: string;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ProductInsert {
  name: string;
  description?: string;
  price: number;
  category: ProductCategory;
  brand?: string;
  image_url?: string;
  stock?: number;
  is_featured?: boolean;
  is_active?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactInsert {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  total_repairs: number;
  total_spent: number;
  is_vip: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerInsert {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

export interface ServiceRate {
  id: string;
  device_type: string;
  service_name: string;
  base_price: number;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface ServiceRateInsert {
  device_type: string;
  service_name: string;
  base_price: number;
  description?: string;
  is_active?: boolean;
}

export interface ActivityLog {
  id: string;
  user_email?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface BookingStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_revenue: number;
  avg_repair_cost: number;
}

export interface PopularDevice {
  device_type: string;
  repair_count: number;
}

// Device Entry (Walk-in customer notebook)
export interface DeviceEntry {
  id: string;
  customer_name: string;
  mobile_number: string;
  village_name?: string;
  address?: string;
  device_type: string;
  device_brand?: string;
  device_model?: string;
  serial_number?: string;
  winding_type?: WindingType;
  motor_hp?: string;
  problem_description: string;
  accessories_received?: string;
  estimated_cost?: number;
  advance_paid?: number;
  final_cost?: number;
  status: DeviceEntryStatus;
  received_date: string;
  expected_delivery?: string;
  delivered_date?: string;
  technician_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DeviceEntryInsert {
  customer_name: string;
  mobile_number: string;
  village_name?: string;
  address?: string;
  device_type: string;
  device_brand?: string;
  device_model?: string;
  serial_number?: string;
  winding_type?: WindingType;
  motor_hp?: string;
  problem_description: string;
  accessories_received?: string;
  estimated_cost?: number;
  advance_paid?: number;
  expected_delivery?: string;
  technician_name?: string;
  notes?: string;
}

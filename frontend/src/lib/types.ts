export type Role = 'CONSUMER' | 'TECHNICIAN';

export interface User {
  id: string;
  role: Role;
  phone_number: string;
  full_name: string;
}

export interface Service {
  id: string;
  title: string;
  base_price: number;
  estimated_duration_mins: number;
  metadata?: {
    category?: string;
    description?: string;
    [key: string]: any;
  };
}

export interface AddressDetails {
  area: string;
  street: string;
  house: string;
  title?: string;
  description?: string;
}

export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  status: BookingStatus;
  service_id: string;
  service?: Service;
  consumer_id: string;
  consumer?: User;
  technician_id?: string;
  technician?: User;
  scheduled_start: string;
  address_details: AddressDetails | string; // Handle both parsed object and stringified JSON for now
  estimated_amount: number;
  final_amount?: number;
  [key: string]: any;
}

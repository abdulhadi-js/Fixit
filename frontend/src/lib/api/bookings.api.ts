import { apiRequest } from './client';
import { Booking, AddressDetails, BookingStatus } from '../types';

export const getMyBookings = () => 
  apiRequest<Booking[]>('/bookings/my', { 
    method: 'GET' 
  });

export const createBooking = (body: {
  service_id: string;
  technician_id?: string;
  scheduled_start: string;
  address_details: AddressDetails;
  estimated_amount: number;
  payment_method?: string;
}) => 
  apiRequest<{ client_secret: string }>('/bookings', { 
    method: 'POST',
    body: JSON.stringify(body)
  });

export const getAgenda = () => 
  apiRequest<Booking[]>('/bookings/agenda', { 
    method: 'GET' 
  });

export const getUnassignedBookings = () => 
  apiRequest<Booking[]>('/bookings/unassigned', { 
    method: 'GET' 
  });

export const claimBooking = (id: string) => 
  apiRequest<{ message: string }>(`/bookings/${id}/claim`, { 
    method: 'POST' 
  });

export const updateBookingStatus = (id: string, status: BookingStatus) => 
  apiRequest<{ message: string }>(`/bookings/${id}/status`, { 
    method: 'PATCH',
    body: JSON.stringify({ status })
  });

export const completeBookingAsConsumer = (id: string) => 
  apiRequest<{ message: string }>(`/bookings/${id}/complete`, { 
    method: 'PATCH' 
  });

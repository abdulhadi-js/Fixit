import { apiRequest } from './client';

export const getTechnicianEarnings = () => 
  apiRequest<any>('/payments/earnings', { 
    method: 'GET' 
  });

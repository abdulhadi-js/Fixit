import { apiRequest } from './client';
import { Service } from '../types';

export const getServices = () => 
  apiRequest<Service[]>('/services', { 
    method: 'GET' 
  });

export const getServiceById = (id: string) => 
  apiRequest<Service>(`/services/${id}`, { 
    method: 'GET' 
  });

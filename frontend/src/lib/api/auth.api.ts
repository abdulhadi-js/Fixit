import { apiRequest } from './client';
import { Role } from '../types';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export const loginUser = (body: { phone_number: string; password: string }) => 
  apiRequest<TokenPair>('/auth/login', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

export const registerUser = (body: { full_name: string; phone_number: string; password: string; role: Role }) => 
  apiRequest<{ message: string }>('/auth/register', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

export const verifyOtp = (body: { phone_number: string; otp_code: string }) => 
  apiRequest<TokenPair>('/auth/verify-otp', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

export const resendOtp = (body: { phone_number: string }) => 
  apiRequest<{ message: string }>('/auth/resend-otp', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

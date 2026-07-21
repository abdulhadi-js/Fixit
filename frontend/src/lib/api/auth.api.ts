import { apiRequest } from './client';
import { Role } from '../types';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export const loginUser = (body: { email: string; password: string }) => 
  apiRequest<TokenPair>('/auth/login', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

export const registerUser = (body: { full_name: string; email: string; password: string; role: Role }) => 
  apiRequest<{ message: string }>('/auth/register', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

export const verifyOtp = (body: { email: string; otp_code: string }) => 
  apiRequest<TokenPair>('/auth/verify-otp', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

export const resendOtp = (body: { email: string }) => 
  apiRequest<{ message: string }>('/auth/resend-otp', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

export const forgotPassword = (body: { email: string }) => 
  apiRequest<{ message: string }>('/auth/forgot-password', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

export const resetPassword = (body: { email: string; otp_code: string; new_password: string }) => 
  apiRequest<{ message: string }>('/auth/reset-password', { 
    method: 'POST', 
    body: JSON.stringify(body) 
  });

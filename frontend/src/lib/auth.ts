import { Role } from './types';

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const setTokens = (access: string, refresh: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const decodeRole = (token: string): Role | null => {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    let base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const payload = JSON.parse(atob(base64));
    return payload.role as Role;
  } catch (error) {
    console.error('Failed to decode role from token', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

import { clearTokens, getToken } from '../auth';

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const fullPath = path.startsWith('/api/v1') ? path : `/api/v1${path}`;
  
  const res = await fetch(`${baseUrl}${fullPath}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  if (!res.ok) {
    let message = 'API Request Failed';
    try {
      const err = await res.json();
      if (Array.isArray(err.message)) {
        message = err.message.join(', ');
      } else {
        message = err.message || message;
      }
    } catch {
      // Ignore JSON parse error on non-JSON response
    }
    throw new Error(message);
  }

  // Handle empty responses or non-JSON responses
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  
  return res.text() as unknown as T;
}

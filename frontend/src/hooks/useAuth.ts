import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, decodeRole, setTokens, clearTokens } from '../lib/auth';
import { loginUser, registerUser, verifyOtp, resendOtp, TokenPair } from '../lib/api/auth.api';
import { Role } from '../lib/types';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setRole(decodeRole(token));
    }
  }, []);

  const handleAuthSuccess = (data: TokenPair) => {
    setTokens(data.access_token, data.refresh_token);
    const decodedRole = decodeRole(data.access_token);
    setRole(decodedRole);
    
    if (decodedRole === 'TECHNICIAN') {
      router.push('/technician/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const login = async (credentials: Parameters<typeof loginUser>[0]) => {
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(credentials);
      handleAuthSuccess(data);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: Parameters<typeof registerUser>[0]) => {
    setLoading(true);
    setError('');
    try {
      await registerUser(data);
      router.push(`/verify-otp?phone=${encodeURIComponent(data.phone_number)}`);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (data: Parameters<typeof verifyOtp>[0]) => {
    setLoading(true);
    setError('');
    try {
      const res = await verifyOtp(data);
      return res; // Let the component handle the redirect after showing success msg
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setRole(null);
    window.location.href = '/login/';
  };

  return {
    loading,
    error,
    role,
    login,
    register,
    verify,
    logout,
    handleAuthSuccess,
    setError
  };
}

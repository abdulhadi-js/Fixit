'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { Role } from '../../../lib/types';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function RegisterPage() {
  const { register, loading, error, setError } = useAuth();
  const [role, setRole] = useState<Role>('CONSUMER');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return; // guard against double-submission
    if (!terms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await register({ full_name: fullName, email, password, role });
      // If register() doesn't throw it will redirect; show message in case redirect is slow
      setSuccess('Registration successful! Redirecting to OTP verification… Check your email for the OTP code.');
    } catch {
      // error is already set inside useAuth.register via setError
    }
  }

  return (
    <div className="bg-canvas text-text-primary antialiased min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-surface-high border border-border-soft rounded-2xl p-8 shadow-sm">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-6">
            <span
              className="material-symbols-outlined text-primary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              handyman
            </span>
            <span className="font-headline-lg text-headline-lg ml-2">FixIt</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg mb-2">Create an account</h1>
          <p className="font-body-md text-body-md text-text-secondary">
            Join FixIt to book or provide home services.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-100 text-green-800 font-label-md text-label-md flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} aria-label="Dismiss error">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div>
            <span className="font-label-md text-label-md text-text-primary block mb-3">
              I am a...
            </span>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="role"
                  type="radio"
                  value="CONSUMER"
                  checked={role === 'CONSUMER'}
                  onChange={() => setRole('CONSUMER')}
                  disabled={loading}
                />
                <div
                  className={`w-full h-full p-4 rounded-xl border text-center transition-colors ${
                    role === 'CONSUMER'
                      ? 'border-primary bg-surface-container-low'
                      : 'border-border-soft bg-surface-high hover:bg-surface-muted'
                  } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`material-symbols-outlined mb-2 block text-2xl ${
                      role === 'CONSUMER' ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    house
                  </span>
                  <span className="font-label-md text-label-md text-text-primary">Consumer</span>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="role"
                  type="radio"
                  value="TECHNICIAN"
                  checked={role === 'TECHNICIAN'}
                  onChange={() => setRole('TECHNICIAN')}
                  disabled={loading}
                />
                <div
                  className={`w-full h-full p-4 rounded-xl border text-center transition-colors ${
                    role === 'TECHNICIAN'
                      ? 'border-primary bg-surface-container-low'
                      : 'border-border-soft bg-surface-high hover:bg-surface-muted'
                  } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`material-symbols-outlined mb-2 block text-2xl ${
                      role === 'TECHNICIAN' ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    build
                  </span>
                  <span className="font-label-md text-label-md text-text-primary">Technician</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
            <Input
              label="Email"
              id="email"
              name="email"
              placeholder="john@example.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              label="Password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                className="w-4 h-4 border-border-soft rounded bg-surface-muted text-primary focus:ring-primary focus:ring-2 disabled:opacity-60"
                id="terms"
                name="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                disabled={loading}
              />
            </div>
            <div className="ml-3 font-body-md text-body-md">
              <label className="text-text-secondary" htmlFor="terms">
                I agree to the{' '}
                <a className="text-primary hover:underline" href="#">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a className="text-primary hover:underline" href="#">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            fullWidth
            id="register-submit-btn"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>

          {loading && (
            <p className="text-center font-body-sm text-text-secondary text-sm mt-1">
              Please wait, registering your account…
            </p>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="font-body-md text-body-md text-text-secondary">
            Already have an account?{' '}
            <Link
              className="text-primary font-label-md text-label-md hover:underline"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!terms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    // Sanitize phone: strip all spaces so "+92 3XX XXXXXXX" becomes "+923XXXXXXXXX" (E.164)
    const sanitizedPhone = phoneNumber.replace(/\s+/g, '');
    await register({ full_name: fullName, phone_number: sanitizedPhone, password, role });
  }

  return (
    <div className="bg-canvas text-text-primary antialiased min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-surface-high border border-border-soft rounded-2xl p-6 md:p-8 shadow-sm">
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md flex justify-between items-center shadow-sm">
            <span>{error}</span>
            <button onClick={() => setError('')}>
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
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
              <label className="relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="role"
                  type="radio"
                  value="CONSUMER"
                  checked={role === 'CONSUMER'}
                  onChange={() => setRole('CONSUMER')}
                />
                <div
                  className={`w-full h-full p-4 rounded-xl border text-center transition-colors ${
                    role === 'CONSUMER'
                      ? 'border-primary bg-surface-container-low'
                      : 'border-border-soft bg-surface-high hover:bg-surface-muted'
                  }`}
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
                />
                <div
                  className={`w-full h-full p-4 rounded-xl border text-center transition-colors ${
                    role === 'TECHNICIAN'
                      ? 'border-primary bg-surface-container-low'
                      : 'border-border-soft bg-surface-high hover:bg-surface-muted'
                  }`}
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
            />
            <Input
              label="Phone Number"
              id="phone"
              name="phone"
              placeholder="+923001234567"
              required
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-text-secondary -mt-2">
              Include country code, e.g. <span className="font-semibold">+923001234567</span>
            </p>
            <Input
              label="Password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                className="w-4 h-4 border-border-soft rounded bg-surface-muted text-primary focus:ring-primary focus:ring-2"
                id="terms"
                name="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
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

          <Button type="submit" loading={loading} fullWidth>
            Create Account
          </Button>
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

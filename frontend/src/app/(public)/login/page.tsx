'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function LoginPage() {
  const { login, loading, error, setError } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const sanitizedPhone = phoneNumber.replace(/\s+/g, '');
    await login({ phone_number: sanitizedPhone, password });
  }

  return (
    <div className="bg-surface-muted min-h-screen flex items-center justify-center p-4">
      {/* Central Bento Card */}
      <main className="w-full max-w-md bg-surface-high rounded-xl border border-border-soft p-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Welcome back</h1>
          <p className="font-body-md text-body-md text-text-secondary">
            Enter your details to sign in to FixIt.
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md flex justify-between items-center shadow-sm">
            <span>{error}</span>
            <button onClick={() => setError('')}>
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Phone Number"
            id="phone_number"
            name="phone_number"
            placeholder="+923001234567"
            required
            type="tel"
            icon="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                className="block font-label-md text-label-md text-text-primary"
                htmlFor="password"
              >
                Password
              </label>
              <a
                className="font-label-md text-label-md text-text-secondary hover:text-primary transition-colors"
                href="#"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type="password"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" loading={loading} fullWidth>
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="font-body-md text-body-md text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link
              className="font-label-md text-label-md text-primary hover:text-accent-hover transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4"
              href="/register"
            >
              Sign up
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}

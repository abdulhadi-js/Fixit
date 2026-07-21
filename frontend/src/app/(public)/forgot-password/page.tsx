'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { forgotPassword } from '../../../lib/api/auth.api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword({ email });
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface-muted min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-surface-high rounded-xl border border-border-soft p-8">
        <header className="mb-8 text-center">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Forgot Password</h1>
          <p className="font-body-md text-body-md text-text-secondary">
            Enter your email to receive a password reset code.
          </p>
        </header>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md flex justify-between items-center shadow-sm">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')}>
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email"
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            type="email"
            icon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" loading={loading} fullWidth>
            Send Reset Code
          </Button>
        </form>

        <footer className="mt-8 text-center">
          <p className="font-body-md text-body-md text-text-secondary">
            Remembered your password?{' '}
            <Link
              className="font-label-md text-label-md text-primary hover:text-accent-hover transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}

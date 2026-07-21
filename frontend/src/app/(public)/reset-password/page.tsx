'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { resetPassword } from '../../../lib/api/auth.api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await resetPassword({ email, otp_code: otpCode, new_password: newPassword });
      setSuccessMsg('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface-muted min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-surface-high rounded-xl border border-border-soft p-8">
        <header className="mb-8 text-center">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Reset Password</h1>
          <p className="font-body-md text-body-md text-text-secondary">
            Enter the 6-digit code sent to your email and your new password.
          </p>
          <p className="font-body-sm text-body-sm text-text-secondary mt-3">
            <span className="font-medium text-primary">Note:</span> Please check your <span className="font-medium text-text-primary">Spam or Junk</span> folder if you don&apos;t see the email in your inbox.
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
        
        {successMsg && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md">
            {successMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email"
            id="email"
            name="email"
            value={email}
            disabled
            type="email"
            icon="mail"
          />
          <Input
            label="OTP Code"
            id="otp_code"
            name="otp_code"
            placeholder="123456"
            required
            type="text"
            icon="password"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
          <Input
            label="New Password"
            id="new_password"
            name="new_password"
            placeholder="••••••••"
            required
            type="password"
            icon="lock"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button type="submit" loading={loading} fullWidth>
            Reset Password
          </Button>
        </form>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

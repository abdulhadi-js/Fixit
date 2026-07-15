'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, ChangeEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { resendOtp } from '../../../lib/api/auth.api';
import { Button } from '../../../components/ui/Button';

function OtpVerificationForm() {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone') || '';
  const { verify, handleAuthSuccess, loading, error, setError } = useAuth();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer (60 seconds)
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMsg('');
    const otp_code = digits.join('');
    if (otp_code.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    
    try {
      const data = await verify({ phone_number: phoneNumber, otp_code });
      setSuccessMsg('Account verified! Redirecting to your dashboard...');
      setTimeout(() => {
        handleAuthSuccess(data);
      }, 1500);
    } catch {
      // Error is handled by useAuth
    }
  }

  async function handleResend() {
    if (!canResend || resendLoading) return;
    setError('');
    setResendLoading(true);
    try {
      await resendOtp({ phone_number: phoneNumber });
      setTimeLeft(60);
      setCanResend(false);
      setDigits(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  }

  const timerDisplay = `0:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;

  return (
    <div className="bg-canvas min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-surface-high rounded-xl p-8 border border-border-soft shadow-sm my-20">
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary mb-2">Verify your account</h1>
            <p className="font-body-md text-body-md text-text-secondary">
              We&apos;ve sent a 6-digit code to your phone number{' '}
              <span className="font-medium text-text-primary">{phoneNumber || '+92 3XX XXXXXXX'}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError('')}>
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md">
              {successMsg}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2 md:gap-3">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  className="w-12 h-14 bg-surface-muted border border-border-soft text-center text-xl font-semibold text-text-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  maxLength={1}
                  required
                  type="number"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
            <Button type="submit" loading={loading} fullWidth>
              Verify & Continue
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-caption text-caption text-text-secondary">
              Didn&apos;t receive the code?{' '}
              {!canResend ? (
                <span className="ml-1">Resend in <span className="font-medium text-text-primary">{timerDisplay}</span></span>
              ) : (
                <button 
                  className="ml-1 text-primary font-medium hover:underline transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={handleResend} 
                  disabled={resendLoading} 
                  type="button"
                >
                  {resendLoading ? 'Sending...' : 'Resend'}
                </button>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>}>
      <OtpVerificationForm />
    </Suspense>
  );
}

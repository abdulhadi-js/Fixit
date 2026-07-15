'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopNav } from '../../components/layout/TopNav';
import { Footer } from '../../components/layout/Footer';
import { isAuthenticated, decodeRole, getToken, clearTokens } from '../../lib/auth';

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const role = decodeRole(getToken()!);
    if (role === 'TECHNICIAN') {
      router.push('/technician/dashboard');
      return;
    } else if (role !== 'CONSUMER') {
      clearTokens();
      router.push('/login');
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-canvas text-on-surface antialiased font-body-md min-h-screen flex flex-col pt-16">
      <TopNav />
      {children}
      <Footer />
    </div>
  );
}

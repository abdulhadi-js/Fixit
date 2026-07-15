'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TechSidebar } from '../../components/layout/TechSidebar';
import { isAuthenticated, decodeRole, getToken, clearTokens } from '../../lib/auth';

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const role = decodeRole(getToken()!);
    if (role === 'CONSUMER') {
      router.push('/dashboard');
      return;
    } else if (role !== 'TECHNICIAN') {
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
    <div className="bg-canvas text-on-surface font-body-md h-screen flex flex-col md:flex-row overflow-hidden">
      <TechSidebar />
      <main className="flex-1 overflow-y-auto bg-canvas p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}

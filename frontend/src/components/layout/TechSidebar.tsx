'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export const TechSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { href: '/technician/dashboard', label: 'Agenda', icon: 'calendar_today' },
    { href: '/technician/job-board', label: 'Job Board', icon: 'work' },
    { href: '/technician/earnings', label: 'Earnings', icon: 'payments' },
  ];

  return (
    <>
      {/* Mobile Nav */}
      <nav className="md:hidden bg-surface-high border-b border-border-soft flex justify-between items-center h-16 px-margin-x w-full z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">handyman</span>
          <span className="font-headline-md text-headline-md text-on-surface font-bold">FixIt Pro</span>
        </div>
        <button className="text-secondary hover:text-primary transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </nav>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-high border-r border-border-soft h-full z-40 relative">
        <div className="p-6 border-b border-border-soft">
          <Link href="/technician/dashboard" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">handyman</span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">FixIt Pro</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 font-label-md text-label-md rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-surface-container text-primary' 
                    : 'text-secondary hover:bg-surface-muted hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-soft">
          <button 
            onClick={logout} 
            className="flex w-full items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-muted hover:text-error font-label-md text-label-md rounded-lg transition-all duration-200"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

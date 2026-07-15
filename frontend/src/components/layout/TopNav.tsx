'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Wrench, Zap, Droplets, Snowflake } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const SERVICES = [
  { name: 'HVAC', icon: Snowflake, desc: 'AC & Heating experts', href: '/services?category=HVAC' },
  { name: 'Electrical', icon: Zap, desc: 'Wiring & fixtures', href: '/services?category=Electrical' },
  { name: 'Plumbing', icon: Droplets, desc: 'Pipes & leaks', href: '/services?category=Plumbing' },
  { name: 'Maintenance', icon: Wrench, desc: 'General home repairs', href: '/services?category=Maintenance' },
  { name: 'Cleaning', icon: Wrench, desc: 'Deep home cleaning', href: '/services?category=Cleaning' },
];

export const TopNav = () => {
  const { role, logout } = useAuth();
  const isLoggedIn = !!role;
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled 
            ? 'bg-surface-high/80 backdrop-blur-md border-b border-border-soft py-3 shadow-sm' 
            : 'bg-transparent py-3 md:py-5'
        )}
      >
        <div className="max-w-container-max mx-auto px-margin-x flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-50">
            <img src="/logo.png" alt="FixIt Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-label-md text-sm text-text-secondary hover:text-primary transition-colors">
              Home
            </Link>
            
            {/* Services Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 font-label-md text-sm text-text-secondary hover:text-primary transition-colors py-2">
                Services
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", servicesOpen ? "rotate-180" : "")} />
              </button>
              
              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] bg-surface-high border border-border-soft rounded-2xl shadow-xl overflow-hidden p-4 grid grid-cols-2 gap-2"
                  >
                    {SERVICES.map((service) => {
                      const Icon = service.icon;
                      return (
                        <Link 
                          key={service.name} 
                          href={service.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-muted transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                            <Icon className="w-5 h-5 text-primary group-hover:text-on-primary transition-colors" />
                          </div>
                          <div>
                            <p className="font-label-md text-sm text-on-surface">{service.name}</p>
                            <p className="font-caption text-xs text-text-secondary mt-0.5">{service.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                    <div className="col-span-2 mt-2 pt-3 border-t border-border-soft text-center">
                      <Link href="/services" className="font-label-md text-sm text-primary hover:underline">
                        View all services &rarr;
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className="font-label-md text-sm text-text-secondary hover:text-primary transition-colors">
              How it works
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <a 
                  href={role === 'TECHNICIAN' ? '/technician/dashboard/' : '/dashboard/'} 
                  className="font-label-md text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Dashboard
                </a>
                {role === 'CONSUMER' && (
                  <a 
                    href="/dashboard/post-job/" 
                    className="font-label-md text-sm text-primary hover:text-accent-hover transition-colors font-medium flex items-center gap-1"
                  >
                    Post a Job
                  </a>
                )}
                <Button variant="ghost" onClick={logout} className="gap-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="font-label-md text-sm text-text-secondary hover:text-primary transition-colors">
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register" className="px-5 py-2.5 bg-primary text-on-primary rounded-full font-label-md text-sm hover:bg-accent-hover transition-colors shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative z-50 p-2 text-text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-surface-high border-l border-border-soft p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pt-16 flex flex-col gap-6 flex-1">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-headline-md text-lg text-on-surface pb-4 border-b border-border-soft">
                  Home
                </Link>
                
                <div className="flex flex-col gap-4 pb-4 border-b border-border-soft">
                  <p className="font-label-md text-sm text-text-secondary uppercase tracking-wider">Services</p>
                  {SERVICES.map((s) => (
                    <Link key={s.name} href={s.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 font-label-md text-on-surface">
                      <s.icon className="w-5 h-5 text-primary" />
                      {s.name}
                    </Link>
                  ))}
                </div>

                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="font-headline-md text-lg text-on-surface pb-4 border-b border-border-soft">
                  How it works
                </Link>
              </div>

              <div className="mt-auto pt-6 flex flex-col gap-4">
                {isLoggedIn ? (
                  <>
                    <a href={role === 'TECHNICIAN' ? '/technician/dashboard/' : '/dashboard/'} onClick={() => setMobileMenuOpen(false)}>
                      <Button fullWidth variant="outline">Dashboard</Button>
                    </a>
                    {role === 'CONSUMER' && (
                      <a href="/dashboard/post-job/" onClick={() => setMobileMenuOpen(false)}>
                        <Button fullWidth variant="outline" className="text-primary border-primary hover:bg-primary/5">Post a Job</Button>
                      </a>
                    )}
                    <Button fullWidth onClick={() => { logout(); setMobileMenuOpen(false); }}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button fullWidth variant="outline">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button fullWidth>Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface-high border-t border-border-soft mt-auto overflow-hidden relative">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-container-max mx-auto px-margin-x pt-12 md:pt-20 pb-8 md:pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <img src="/logo.png" alt="FixIt Logo" className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" />
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              The premier platform connecting homeowners with elite, background-checked professionals for all repair and maintenance needs.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full border border-border-soft flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-border-soft flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-border-soft flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-full border border-border-soft flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold text-on-surface mb-4">Services</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/services?category=HVAC" className="text-sm text-text-secondary hover:text-primary transition-colors">HVAC</Link></li>
              <li><Link href="/services?category=Electrical" className="text-sm text-text-secondary hover:text-primary transition-colors">Electrical</Link></li>
              <li><Link href="/services?category=Plumbing" className="text-sm text-text-secondary hover:text-primary transition-colors">Plumbing</Link></li>
              <li><Link href="/services?category=Maintenance" className="text-sm text-text-secondary hover:text-primary transition-colors">Maintenance</Link></li>
              <li><Link href="/services" className="text-sm text-primary font-medium hover:underline flex items-center gap-1 mt-1">All Services <ArrowRight className="w-3 h-3" /></Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold text-on-surface mb-4">Company</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-sm text-text-secondary hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/about" className="text-sm text-text-secondary hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold text-on-surface mb-4">Professionals</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/register" className="text-sm text-text-secondary hover:text-primary transition-colors">Become a Tech</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Pro App</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Guidelines</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Tech Support</Link></li>
            </ul>
          </div>

          {/* Links Column 4 */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-bold text-on-surface mb-4">Legal</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Licenses</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-border-soft flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-sm text-text-secondary">All systems operational</span>
          </div>
          
          <p className="text-sm text-text-secondary text-center md:text-left">
            © {new Date().getFullYear()} FixIt Home Services. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <button className="text-sm text-text-secondary hover:text-on-surface transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">globe</span>
              Pakistan (EN)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

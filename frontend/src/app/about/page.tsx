'use client';

import { motion } from 'framer-motion';
import { TopNav } from '../../components/layout/TopNav';
import { Footer } from '../../components/layout/Footer';
import { ShieldCheck, Clock, CheckCircle2, Wrench, Search, CreditCard, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function AboutPage() {
  const { role } = useAuth();
  const isLoggedIn = !!role;

  const FADE_UP = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
  };

  const STEPS = [
    {
      title: "1. Find Your Service",
      description: "Browse our comprehensive catalog of home repair and maintenance services. We provide upfront, transparent pricing so you always know what to expect.",
      icon: Search,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "2. Secure Your Booking",
      description: "Select a date and time that fits your schedule. Enter your address and payment details securely. Your card is only charged once the job is completed to your satisfaction.",
      icon: CreditCard,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "3. The Pro Arrives",
      description: "A thoroughly vetted, background-checked technician will arrive at your doorstep equipped with the right tools and expertise to handle the job.",
      icon: Wrench,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "4. Job Done & Guaranteed",
      description: "Relax while the expert works. Once completed, you approve the work, the payment is released, and your home is back to running smoothly.",
      icon: Sparkles,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="bg-canvas text-on-surface antialiased font-body-md min-h-screen flex flex-col relative overflow-hidden">
      {/* Global Background */}
      <div className="absolute inset-0 z-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_at_top,white,transparent_80%)] pointer-events-none opacity-60"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav />
        
        {/* Header Section */}
        <section className="pt-32 pb-16 px-margin-x">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.h1 variants={FADE_UP} className="font-display-lg text-5xl md:text-6xl font-bold text-on-surface mb-6">
                How <span className="text-primary">FixIt</span> Works
              </motion.h1>
              <motion.p variants={FADE_UP} className="font-body-lg text-xl text-text-secondary">
                We've revolutionized home maintenance by bringing transparency, security, and elite professionalism straight to your door.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Step-by-Step Section */}
        <section className="py-16 px-margin-x">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                {STEPS.map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm ${step.color}`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-on-surface mb-2">{step.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 rounded-full blur-[100px] -z-10"></div>
                <div className="bg-surface-high border border-border-soft rounded-3xl overflow-hidden shadow-2xl relative">
                  <img 
                    src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=1000&auto=format&fit=crop" 
                    alt="Customer App"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-high via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-surface-high/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-border-soft flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">Payment Released</p>
                        <p className="text-sm text-text-secondary">Job marked as completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 px-margin-x bg-surface-muted/50 border-y border-border-soft mt-12">
          <div className="max-w-container-max mx-auto text-center">
            <h2 className="text-3xl font-bold text-on-surface mb-12">The FixIt Guarantee</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-surface-high p-8 rounded-2xl border border-border-soft shadow-sm hover:shadow-md transition-shadow text-left">
                <ShieldCheck className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">Vetted Professionals</h3>
                <p className="text-text-secondary">Every technician undergoes a rigorous background check and skills assessment before joining our platform.</p>
              </div>
              <div className="bg-surface-high p-8 rounded-2xl border border-border-soft shadow-sm hover:shadow-md transition-shadow text-left">
                <CreditCard className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">Transparent Pricing</h3>
                <p className="text-text-secondary">No hidden fees or surprise hourly rates. You approve the exact cost before the technician even departs.</p>
              </div>
              <div className="bg-surface-high p-8 rounded-2xl border border-border-soft shadow-sm hover:shadow-md transition-shadow text-left">
                <Clock className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">Punctuality</h3>
                <p className="text-text-secondary">Your time is valuable. Our scheduling system ensures pros arrive precisely within the booked time window.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-margin-x text-center">
          <h2 className="text-4xl font-bold text-on-surface mb-6">Ready to fix it?</h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Experience the easiest way to handle your home repairs today.
          </p>
          {isLoggedIn ? (
            <Link href={role === 'TECHNICIAN' ? '/technician/dashboard' : '/services'} className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-xl font-bold hover:bg-accent-hover transition-colors shadow-lg">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-xl font-bold hover:bg-accent-hover transition-colors shadow-lg hover:-translate-y-1">
              Book a Service Now
            </Link>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import { Marquee } from '../components/ui/Marquee';
import { BentoGrid, BentoCard } from '../components/ui/BentoGrid';
import { Meteors } from '../components/ui/Meteors';
import { Zap, Snowflake, Droplets, Wrench, ShieldCheck, Clock, Star, ArrowRight } from 'lucide-react';

const REVIEWS = [
  { name: 'Sarah M.', body: 'Fixed my AC in under 2 hours. Professional and clean!', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah' },
  { name: 'Ali K.', body: 'The pricing was completely transparent. No hidden fees.', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ali' },
  { name: 'Fatima R.', body: 'Booking was so easy. The tech was very polite.', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Fatima' },
  { name: 'John D.', body: 'Best plumbing service I have ever used. Highly recommended.', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=John' },
  { name: 'Ayesha S.', body: 'Electrical issues sorted within the same day. Amazing!', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ayesha' },
];

const BENTO_FEATURES = [
  {
    name: 'HVAC Specialists',
    description: 'Expert AC repair and maintenance for optimal cooling.',
    href: '/services?category=hvac',
    cta: 'Book HVAC',
    Icon: Snowflake,
    className: 'lg:col-span-1',
    background: <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop" alt="HVAC" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />,
  },
  {
    name: 'Electrical Repairs',
    description: 'Safe and certified electrical wiring and fixture installations.',
    href: '/services?category=electrical',
    cta: 'Book Electrical',
    Icon: Zap,
    className: 'lg:col-span-2',
    background: <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop" alt="Electrical" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />,
  },
  {
    name: 'Plumbing Solutions',
    description: 'Quick leak fixes, pipe installations, and drainage clearing.',
    href: '/services?category=plumbing',
    cta: 'Book Plumbing',
    Icon: Droplets,
    className: 'lg:col-span-2',
    background: <img src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop" alt="Plumbing" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />,
  },
  {
    name: 'General Maintenance',
    description: 'Handyman services for everyday home repairs and installations.',
    href: '/services?category=maintenance',
    cta: 'Book Handyman',
    Icon: Wrench,
    className: 'lg:col-span-1',
    background: <img src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=600&auto=format&fit=crop" alt="Maintenance" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />,
  },
];

export default function Home() {
  const { role } = useAuth();
  const isLoggedIn = !!role;

  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
  };

  return (
    <div className="bg-canvas text-on-surface antialiased font-body-md min-h-screen flex flex-col relative">
      {/* Global Premium Background */}
      <div className="absolute inset-0 z-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_at_top,white,transparent_80%)] pointer-events-none opacity-60"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav />
      
        {/* 1. Hero Section with Glow Effects & Split Layout */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
          {/* Enhanced Glow Effects */}
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-70" />
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-60" />
        
        <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-x flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Text Content */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            className="flex-1 flex flex-col items-start text-left gap-6"
          >
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-label-md text-sm border border-primary/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now available in Lahore & Islamabad
              </span>
            </motion.div>

            <motion.h1 
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="font-display-lg text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-on-surface leading-[1.1]"
            >
              Expert Home Repairs, <br />
              <span className="text-primary bg-clip-text">Just a Click Away</span>
            </motion.h1>

            <motion.p 
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="font-body-lg text-lg md:text-xl text-text-secondary max-w-xl"
            >
              Book verified technicians instantly. Transparent pricing, guaranteed quality, and seamless tracking from start to finish.
            </motion.p>

            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
              {isLoggedIn ? (
                <Link href={role === 'TECHNICIAN' ? '/technician/dashboard' : '/dashboard'} className="px-8 py-4 bg-primary text-on-primary rounded-xl font-label-lg hover:bg-accent-hover transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1 flex items-center justify-center gap-2">
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link href="/services" className="px-8 py-4 bg-primary text-on-primary rounded-xl font-label-lg hover:bg-accent-hover transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1 flex items-center justify-center gap-2">
                    Book a Service <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/register" className="px-8 py-4 bg-surface-high border border-border-soft text-text-primary rounded-xl font-label-lg hover:bg-surface-muted transition-all hover:-translate-y-1 flex items-center justify-center">
                    Become a Pro
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="flex-1 w-full relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-blue-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
            <div className="relative bg-surface-high/50 backdrop-blur-xl border border-white/20 rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden group">
              <img 
                className="w-full h-auto max-h-[600px] rounded-[1.5rem] object-cover group-hover:scale-105 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop" 
                alt="Professional technician at work"
              />
              
              {/* Floating elements inside the image area */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 bg-surface-high/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-border-soft shadow-xl flex items-center gap-3 sm:gap-4 scale-90 sm:scale-100 origin-bottom-left"
              >
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-label-md text-sm text-on-surface">Verified Expert</p>
                  <p className="font-caption text-xs text-text-secondary">Background checked</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-surface-high/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-border-soft shadow-xl flex items-center gap-3 sm:gap-4 scale-90 sm:scale-100 origin-top-right"
              >
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-label-md text-sm text-on-surface">AC Repair</p>
                  <p className="font-caption text-xs text-text-secondary">Booked just now</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Logo Ticker / Social Proof */}
      <section className="w-full py-12 border-y border-border-soft bg-surface-high overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-x mb-6 text-center">
          <p className="font-label-md text-sm text-text-secondary uppercase tracking-widest">Trusted by 10,000+ households</p>
        </div>
        <Marquee className="max-w-5xl mx-auto" pauseOnHover>
          {["Forbes", "TechCrunch", "Dawn", "Tribune", "StartupPK", "Wired"].map((logo) => (
            <div key={logo} className="mx-8 font-display-lg text-2xl md:text-3xl font-bold text-text-secondary/30 grayscale opacity-70 hover:opacity-100 hover:text-primary transition-all cursor-default">
              {logo}
            </div>
          ))}
        </Marquee>
      </section>

      {/* 3. Services Bento Grid */}
      <section className="w-full py-24 px-margin-x bg-canvas">
        <div className="max-w-container-max mx-auto">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-center mb-16"
          >
            <h2 className="font-display-md text-4xl font-bold text-on-surface mb-4">Our Premium Services</h2>
            <p className="font-body-md text-text-secondary max-w-2xl mx-auto text-lg">
              Everything you need to keep your home running perfectly, delivered by certified professionals.
            </p>
          </motion.div>

          <BentoGrid className="max-w-5xl mx-auto lg:grid-cols-3">
            {BENTO_FEATURES.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* 4. Interactive How It Works */}
      <section className="w-full bg-surface-high relative border-y border-border-soft">
        <div className="max-w-container-max mx-auto px-margin-x flex flex-col md:flex-row items-start gap-12 relative">
          
          {/* Left Text (Scrolls natively) */}
          <div className="w-full md:w-1/2 flex flex-col py-16 md:py-24 md:pb-[30vh]">
            <div className="mb-12">
              <h2 className="font-display-md text-3xl md:text-4xl font-bold text-on-surface mb-4">How it works</h2>
              <p className="font-body-lg text-text-secondary text-lg">Three simple steps to a better home.</p>
            </div>

            <div className="min-h-[60vh] flex flex-col justify-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display-md text-2xl border border-primary/20 shadow-sm">1</div>
              <h3 className="font-display-md text-3xl font-bold text-on-surface">Browse & Select</h3>
              <p className="font-body-lg text-text-secondary text-lg max-w-md">Choose from our wide range of services. See upfront pricing before you commit to anything.</p>
            </div>
            
            <div className="min-h-[60vh] flex flex-col justify-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display-md text-2xl border border-primary/20 shadow-sm">2</div>
              <h3 className="font-display-md text-3xl font-bold text-on-surface">Secure Booking</h3>
              <p className="font-body-lg text-text-secondary text-lg max-w-md">Pick a time that works for you. A temporary hold is placed on your card, fully secured by Stripe.</p>
            </div>

            <div className="min-h-[60vh] flex flex-col justify-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display-md text-2xl border border-primary/20 shadow-sm">3</div>
              <h3 className="font-display-md text-3xl font-bold text-on-surface">Job Completed</h3>
              <p className="font-body-lg text-text-secondary text-lg max-w-md">Our certified technician arrives, completes the work to our high standards, and payment is released.</p>
            </div>
          </div>

          {/* Right Image (Sticky) */}
          <div className="hidden md:flex w-full md:w-1/2 sticky top-0 h-screen items-center justify-center py-24">
            <div className="relative w-full aspect-square max-h-[600px] bg-surface-muted rounded-[2rem] border border-border-soft overflow-hidden shadow-2xl">
                 <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop"
                    alt="Process"
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                 
                 <div className="absolute bottom-10 left-10 right-10 p-6 bg-surface-high/95 backdrop-blur-md rounded-xl shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-on-surface">Seamless Process</p>
                      <p className="text-sm text-text-secondary">From booking to completion</p>
                    </div>
                 </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Testimonials Marquee */}
      <section className="w-full py-24 px-margin-x bg-canvas overflow-hidden">
        <div className="max-w-container-max mx-auto mb-16 text-center">
          <h2 className="font-display-md text-4xl font-bold text-on-surface mb-4">Loved by Homeowners</h2>
        </div>
        
        <Marquee pauseOnHover className="[--duration:30s]">
          {REVIEWS.map((review) => (
            <div key={review.name} className="w-[300px] md:w-[350px] bg-surface-high border border-border-soft rounded-2xl p-5 md:p-6 shadow-sm mx-3 md:mx-4 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-yellow-400">
                {Array(5).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-text-primary font-body-md italic">"{review.body}"</p>
              <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border-soft">
                <img src={review.img} alt={review.name} className="w-10 h-10 rounded-full bg-surface-muted" />
                <span className="font-label-md text-sm font-semibold">{review.name}</span>
              </div>
            </div>
          ))}
        </Marquee>
      </section>

      {/* 6. Technician CTA (Meteors) */}
      <section className="w-full px-margin-x py-12 bg-canvas">
        <div className="max-w-container-max mx-auto">
          <div className="relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-slate-950 md:shadow-xl border border-slate-800 py-12 px-4">
            <Meteors number={30} />
            
            <div className="z-10 flex flex-col items-center text-center p-8">
              <h2 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-white to-slate-300/80 bg-clip-text text-center text-4xl md:text-5xl font-bold leading-none text-transparent mb-6">
                Are you a skilled professional?
              </h2>
              <p className="text-slate-400 max-w-xl text-lg mb-8">
                Join our network of elite technicians. Set your own schedule, grow your business, and get paid instantly upon job completion.
              </p>
              <Link href="/register" className="px-8 py-4 bg-white text-slate-950 rounded-xl font-label-lg font-bold hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Apply as a Technician
              </Link>
            </div>
          </div>
        </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

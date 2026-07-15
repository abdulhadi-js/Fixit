'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useServices } from '../../../hooks/useServices';
import { TopNav } from '../../../components/layout/TopNav';
import { Footer } from '../../../components/layout/Footer';
import { Wrench, Zap, Droplets, Wind, Home, Layers } from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
    'Cleaning': Home,
    'Electrical': Zap,
    'Plumbing': Droplets,
    'HVAC': Wind,
    'Maintenance': Wrench,
    'All': Layers
};

export default function ServicesPage() {
    const { services, loading, error } = useServices();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Extract unique categories from metadata
    const categories = useMemo(() => {
        const cats = new Set<string>();
        services.forEach(s => {
            if (s.metadata?.category) cats.add(s.metadata.category);
        });
        return ['All', ...Array.from(cats)];
    }, [services]);

    useEffect(() => {
        if (typeof window !== 'undefined' && categories.length > 1) {
            const params = new URLSearchParams(window.location.search);
            const queryCat = params.get('category');
            if (queryCat && categories.includes(queryCat)) {
                setSelectedCategory(queryCat);
            }
        }
    }, [categories]);

    const filteredServices = useMemo(() => {
        if (selectedCategory === 'All') return services;
        return services.filter(s => s.metadata?.category === selectedCategory);
    }, [services, selectedCategory]);

    return (
        <div className="bg-canvas text-text-primary flex flex-col min-h-screen relative">
            <TopNav />
            
            {/* Hero Section */}
            <div className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 [mask-image:linear-gradient(to_bottom,white,transparent)] z-0"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-margin-x relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display-md text-4xl sm:text-5xl md:text-6xl font-extrabold text-on-surface mb-6 tracking-tight"
                    >
                        Premium Home Services
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto"
                    >
                        Expert technicians for every corner of your home. Book a service and let our verified professionals handle the rest.
                    </motion.p>
                </div>
            </div>

            <main className="flex-1 max-w-container-max mx-auto w-full px-margin-x pb-24 relative z-10">
                {/* Filters */}
                <div className="mb-12 flex flex-col items-center">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-surface-high p-2 rounded-2xl border border-border-soft shadow-sm max-w-full overflow-x-auto hide-scrollbar">
                        {categories.map((cat, idx) => {
                            const Icon = CATEGORY_ICONS[cat] || Layers;
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-label-md text-sm transition-all duration-200 ${
                                        isSelected 
                                        ? 'bg-primary text-on-primary shadow-md shadow-primary/25 scale-105' 
                                        : 'bg-transparent text-text-secondary hover:bg-surface-muted hover:text-on-surface'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && (
                    <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-8 flex items-center justify-center">
                        <span className="material-symbols-outlined mr-2">error</span>
                        {error}
                    </div>
                )}

                {/* Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <motion.div key={`skel-${i}`} className="bg-surface-high border border-border-soft rounded-3xl overflow-hidden h-80 animate-pulse">
                                    <div className="h-40 bg-surface-muted"></div>
                                    <div className="p-6 space-y-4">
                                        <div className="h-6 bg-surface-muted rounded w-3/4"></div>
                                        <div className="h-4 bg-surface-muted rounded w-full"></div>
                                        <div className="h-4 bg-surface-muted rounded w-5/6"></div>
                                    </div>
                                </motion.div>
                            ))
                        ) : filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    key={service.id} 
                                    className="bg-surface-high border border-border-soft rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                                >
                                    <div className="h-48 w-full bg-surface-muted relative overflow-hidden">
                                        {/* Since we don't have dedicated images in DB, we'll use an elegant gradient fallback or an un-splash placeholder based on category */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-105 transition-transform duration-500"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {(() => {
                                                const Icon = CATEGORY_ICONS[service.metadata?.category || 'All'] || Layers;
                                                return <Icon className="w-16 h-16 text-primary/40 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />;
                                            })()}
                                        </div>
                                        <div className="absolute top-4 left-4 bg-surface-high/90 backdrop-blur text-primary px-3 py-1 rounded-full font-label-md text-xs shadow-sm border border-border-soft">
                                            {service.metadata?.category || 'Service'}
                                        </div>
                                    </div>
                                    <div className="p-5 md:p-6 flex flex-col flex-1 relative z-10 bg-surface-high">
                                        <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors">{service.title}</h3>
                                        <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                                            {service.metadata?.description || "Expert service provided by our top-rated technicians."}
                                        </p>
                                        
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-text-secondary bg-surface-muted px-3 py-1.5 rounded-lg">
                                                <Wind className="w-4 h-4" />
                                                <span className="font-caption text-xs font-medium">{service.estimated_duration_mins} min avg</span>
                                            </div>
                                            <Link href={`/services/service-detail?id=${service.id}`} className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary w-10 h-10 rounded-full flex items-center justify-center transition-colors group/btn">
                                                <span className="material-symbols-outlined text-[20px] group-hover/btn:translate-x-0.5 transition-transform">arrow_forward</span>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="col-span-full py-20 flex flex-col items-center justify-center bg-surface-high border border-border-soft rounded-3xl text-text-secondary shadow-sm"
                            >
                                <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mb-4">
                                    <Layers className="w-10 h-10 text-text-secondary/50" />
                                </div>
                                <h3 className="font-headline-md text-xl text-on-surface mb-2">No services found</h3>
                                <p className="font-body-md text-center max-w-sm">We couldn't find any services in this category right now. Check back later!</p>
                                <button onClick={() => setSelectedCategory('All')} className="mt-6 text-primary font-bold hover:underline">
                                    View all services
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

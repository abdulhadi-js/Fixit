'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useService } from '../../../../hooks/useServices';
import { useAuth } from '../../../../hooks/useAuth';
import { TopNav } from '../../../../components/layout/TopNav';
import { Footer } from '../../../../components/layout/Footer';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

function ServiceDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id') as string;
    
    const { service, loading, error } = useService(id);
    const { role } = useAuth();
    const isLoggedIn = !!role;

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [area, setArea] = useState('');
    const [street, setStreet] = useState('');
    const [house, setHouse] = useState('');

    const handleBooking = () => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        
        if (!date || !time || !area || !street || !house) {
            alert('Please fill out all scheduling and address details.');
            return;
        }
        
        const fullAddress = `${house}, ${street}, ${area}`;
        router.push(`/checkout?service_id=${id}&date=${date}&time=${time}&address=${encodeURIComponent(fullAddress)}&amount=${service?.base_price}`);
    };

    if (loading) {
        return (
            <div className="bg-canvas text-text-primary min-h-screen flex flex-col pt-16">
                <TopNav />
                <div className="flex-1 flex justify-center items-center">
                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="bg-canvas text-text-primary min-h-screen flex flex-col pt-16">
                <TopNav />
                <div className="flex-1 flex justify-center items-center p-8">
                    <div className="bg-error-container text-on-error-container p-6 rounded-xl max-w-md w-full text-center">
                        <span className="material-symbols-outlined text-4xl mb-4">error</span>
                        <h2 className="font-headline-md mb-2">Service Not Found</h2>
                        <p>{error || 'The service you are looking for does not exist.'}</p>
                        <Link href="/services" className="mt-6 inline-block text-primary hover:underline font-label-md">
                            Browse other services
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-canvas text-text-primary flex flex-col min-h-screen pt-16">
            <TopNav />

            <main className="flex-1 w-full max-w-container-max mx-auto px-margin-x py-12 flex flex-col lg:flex-row gap-12">
                <div className="w-full lg:w-2/3">
                    <div className="w-full h-64 sm:h-96 bg-surface-muted rounded-2xl overflow-hidden mb-8 shadow-sm">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHFew7Pg3S27NnkuGed6XYH2NPDAQU_QHSGu3c0duPNbOeOtHvf0sCCZDOem45cppEsAf3fEsDs_CXu1HPpLgHkzfyxdPOb9ZNXSsfuYO9jqT_YgU956TZxccP_ezFGCrEyD95TJBYlB5Sfx381bKNx0muAfBsOdWDzCtg2-ICjexqss_PMfStos0AnncdVSacosYt2UP7L9brf1aaW5wRCg89SVGRd68X6eFrxT6miE82jqH4hmsUdjAQAdAOAxBesmhD3RW3srs" alt={service.title} />
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                        <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-md text-xs tracking-wider uppercase">
                            {service.metadata?.category || 'Maintenance'}
                        </span>
                    </div>

                    <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">{service.title}</h1>
                    
                    <div className="prose prose-p:text-text-secondary prose-p:font-body-md max-w-none mb-8">
                        <p>{service.metadata?.description || 'Professional service delivered by verified experts. We ensure high-quality workmanship for your home.'}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                        <div className="bg-surface-high border border-border-soft p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                            <span className="material-symbols-outlined text-primary mb-2">schedule</span>
                            <span className="font-label-md text-label-md text-on-surface">{service.estimated_duration_mins} Mins</span>
                            <span className="font-caption text-caption text-text-secondary">Duration</span>
                        </div>
                        <div className="bg-surface-high border border-border-soft p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                            <span className="material-symbols-outlined text-primary mb-2">verified</span>
                            <span className="font-label-md text-label-md text-on-surface">Verified</span>
                            <span className="font-caption text-caption text-text-secondary">Professionals</span>
                        </div>
                        <div className="bg-surface-high border border-border-soft p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                            <span className="material-symbols-outlined text-primary mb-2">shield</span>
                            <span className="font-label-md text-label-md text-on-surface">Guaranteed</span>
                            <span className="font-caption text-caption text-text-secondary">Work Quality</span>
                        </div>
                        <div className="bg-surface-high border border-border-soft p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                            <span className="material-symbols-outlined text-primary mb-2">support_agent</span>
                            <span className="font-label-md text-label-md text-on-surface">24/7</span>
                            <span className="font-caption text-caption text-text-secondary">Support</span>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/3">
                    <div className="sticky top-24 bg-surface-high border border-border-soft rounded-2xl p-6 shadow-sm">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Schedule Service</h2>
                        
                        <div className="mb-8 pb-6 border-b border-border-soft">
                            <p className="font-body-md text-text-secondary">Fill out the details below to schedule this service.</p>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div>
                                <h3 className="font-label-md text-text-primary mb-3">1. Select Date & Time</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-label-md text-text-primary mb-3">2. Service Address</h3>
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Area / Neighborhood"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        required
                                    />
                                    <Input
                                        placeholder="Street / Road"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                        required
                                    />
                                    <Input
                                        placeholder="House / Apartment Number"
                                        value={house}
                                        onChange={(e) => setHouse(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={handleBooking} 
                            fullWidth 
                            disabled={!date || !time || !area || !street || !house}
                        >
                            Proceed to Checkout
                        </Button>
                        <p className="font-caption text-caption text-center text-text-secondary mt-4">
                            You won't be charged yet.
                        </p>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default function ServiceDetailsPage() {
    return (
        <Suspense fallback={<div>Loading service details...</div>}>
            <ServiceDetailsContent />
        </Suspense>
    );
}

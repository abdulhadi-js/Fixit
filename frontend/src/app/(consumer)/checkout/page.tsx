'use client';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCreateBooking } from '../../../hooks/useBookings';
import { useService } from '../../../hooks/useServices';
import { Button } from '../../../components/ui/Button';

// Load Stripe outside of component render to avoid recreating Stripe object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

function CheckoutForm({ total, onSuccess }: { total: number, onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
            setIsProcessing(false);
        } else if (paymentIntent && (paymentIntent.status === 'requires_capture' || paymentIntent.status === 'succeeded')) {
            onSuccess();
        } else {
            setErrorMessage('Payment failed or requires further action.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            {errorMessage && (
                <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm">
                    {errorMessage}
                </div>
            )}
            <div className="mt-8">
                <Button disabled={isProcessing || !stripe || !elements} loading={isProcessing} type="submit" fullWidth>
                    Authorize Payment Hold - Rs. {total}
                </Button>
                <p className="text-caption font-caption text-text-secondary text-center mt-3">You won't be charged until the job is complete.</p>
            </div>
        </form>
    );
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const service_id = searchParams?.get('service_id');
    const date = searchParams?.get('date');
    const time = searchParams?.get('time');
    const address = searchParams?.get('address') || '';
    const amount = searchParams?.get('amount');

    const { service, loading: serviceLoading } = useService(service_id || undefined);
    const { submitBooking, loading, error, setError } = useCreateBooking();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH'>('CARD');

    const handleCreateBookingAndIntent = async () => {
        if (!service_id || !date || !time) return;
        
        try {
            // Parse comma separated address into DTO format (fallback to string if needed)
            const parts = address.split(', ');
            const addressDetails = parts.length === 3 
                ? { house: parts[0], street: parts[1], area: parts[2] } 
                : { house: address, street: '', area: '' };

            const data = await submitBooking({
                service_id,
                scheduled_start: `${date}T${time}:00Z`,
                address_details: addressDetails,
                estimated_amount: amount ? Number(amount) : (service?.base_price || 0),
                payment_method: paymentMethod
            });
            
            if (paymentMethod === 'CASH') {
                router.push('/booking-success');
            } else {
                setClientSecret(data.client_secret);
            }
        } catch (err: any) {
            // Error is handled by useCreateBooking
        }
    };

    if (serviceLoading || !service) return <div className="p-12 text-center text-text-secondary font-body-md min-h-screen">Loading...</div>;

    const subtotal = amount ? Number(amount) : Number(service.base_price);
    const taxes = 150;
    const total = subtotal + taxes;

    return (
        <main className="flex-grow pb-16 px-margin-x max-w-container-max mx-auto w-full pt-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <Link href={`/services/${service_id}`} className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-headline-lg font-headline-lg text-on-surface">Secure Checkout</h1>
                        <p className="text-text-secondary mt-2">Complete your booking securely.</p>
                    </div>
                </div>
                
                {error && (
                    <div className="mb-6 bg-error-container text-on-error-container p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <span>{error}</span>
                        <button onClick={() => setError('')}>
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="bg-surface-high border border-border-soft rounded-xl p-6 shadow-sm flex flex-col gap-6">
                        <div>
                            <h2 className="text-headline-md font-headline-md text-on-surface mb-4">Order Summary</h2>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 rounded-lg bg-surface-muted overflow-hidden flex-shrink-0">
                                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHFew7Pg3S27NnkuGed6XYH2NPDAQU_QHSGu3c0duPNbOeOtHvf0sCCZDOem45cppEsAf3fEsDs_CXu1HPpLgHkzfyxdPOb9ZNXSsfuYO9jqT_YgU956TZxccP_ezFGCrEyD95TJBYlB5Sfx381bKNx0muAfBsOdWDzCtg2-ICjexqss_PMfStos0AnncdVSacosYt2UP7L9brf1aaW5wRCg89SVGRd68X6eFrxT6miE82jqH4hmsUdjAQAdAOAxBesmhD3RW3srs" alt="Service" />
                                </div>
                                <div>
                                    <h3 className="font-label-md text-label-md text-on-surface">{service.title}</h3>
                                    <p className="text-text-secondary text-sm mt-1">Scheduled: {date} @ {time}</p>
                                    <p className="text-text-secondary text-sm line-clamp-2">Address: {address}</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-border-soft pt-4">
                            <div className="flex justify-between text-text-secondary mb-2">
                                <span>Subtotal</span>
                                <span>Rs. {subtotal}</span>
                            </div>
                            <div className="flex justify-between text-text-secondary mb-4">
                                <span>Taxes & Fees</span>
                                <span>Rs. {taxes}</span>
                            </div>
                            <div className="flex justify-between text-on-surface font-headline-md text-headline-md border-t border-border-soft pt-4">
                                <span>Total</span>
                                <span>Rs. {total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-high border border-border-soft rounded-xl p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-headline-md font-headline-md text-on-surface">Payment Details</h2>
                                <div className="flex items-center gap-1 text-primary bg-primary-container/10 px-2 py-1 rounded-md text-xs font-label-md">
                                    <span className="material-symbols-outlined" style={{fontSize: '16px'}}>lock</span>
                                    Secure SSL
                                </div>
                            </div>
                            
                            {!clientSecret ? (
                                <div className="flex flex-col py-4">
                                    <p className="text-text-secondary mb-6">Select your preferred payment method.</p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                        <button 
                                            onClick={() => setPaymentMethod('CARD')}
                                            className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${paymentMethod === 'CARD' ? 'border-primary bg-primary/10 text-primary' : 'border-border-soft bg-canvas text-text-secondary hover:border-primary/50'}`}
                                        >
                                            <span className="material-symbols-outlined mb-2 text-2xl">credit_card</span>
                                            <span className="font-bold text-sm">Credit Card</span>
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMethod('CASH')}
                                            className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${paymentMethod === 'CASH' ? 'border-primary bg-primary/10 text-primary' : 'border-border-soft bg-canvas text-text-secondary hover:border-primary/50'}`}
                                        >
                                            <span className="material-symbols-outlined mb-2 text-2xl">payments</span>
                                            <span className="font-bold text-sm">Cash on Delivery</span>
                                        </button>
                                    </div>
                                    
                                    <Button 
                                        onClick={handleCreateBookingAndIntent} 
                                        loading={loading}
                                        fullWidth
                                    >
                                        {paymentMethod === 'CARD' ? 'Proceed to Secure Payment' : 'Confirm Cash Booking'}
                                    </Button>
                                </div>
                            ) : (
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#10b981', colorBackground: '#18181b', colorText: '#e4e4e7', colorDanger: '#ef4444', fontFamily: 'Geist, sans-serif' } } }}>
                                    <CheckoutForm 
                                        total={total} 
                                        onSuccess={() => {
                                            router.push('/booking-success');
                                        }} 
                                    />
                                </Elements>
                            )}
                            
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-text-secondary">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}

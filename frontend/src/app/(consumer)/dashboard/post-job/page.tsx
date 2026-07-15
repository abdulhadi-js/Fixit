'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../hooks/useAuth';
import { useCreateBooking } from '../../../../hooks/useBookings';
import { TopNav } from '../../../../components/layout/TopNav';
import { ArrowLeft, ArrowRight, CheckCircle2, Home, MapPin, Calendar, DollarSign, Wrench, Package, CreditCard, Banknote } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

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
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {errorMessage}
                </div>
            )}
            <div className="mt-8">
                <button disabled={isProcessing || !stripe || !elements} type="submit" className="w-full px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                    {isProcessing ? 'Processing...' : `Authorize Payment Hold - Rs. ${total}`}
                </button>
                <p className="text-sm text-text-secondary text-center mt-3">You won't be charged until the job is complete.</p>
            </div>
        </form>
    );
}

const CATEGORIES = [
  { id: 'PLUMBING', label: 'Plumbing', icon: Wrench },
  { id: 'ELECTRICAL', label: 'Electrical', icon: SparklesIcon },
  { id: 'HVAC', label: 'AC & HVAC', icon: WindIcon },
  { id: 'MAINTENANCE', label: 'General Fix', icon: Home },
  { id: 'CUSTOM', label: 'Custom Job', icon: Package },
];

function SparklesIcon(props: any) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; }
function WindIcon(props: any) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" /></svg>; }

export default function PostJobPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { submitBooking, loading: isSubmitting } = useCreateBooking();
  const [cities, setCities] = useState<string[]>(['Lahore', 'Islamabad', 'Karachi']);
  const [loadingCities, setLoadingCities] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CARD');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: 'pakistan' })
        });
        const data = await res.json();
        if (data && !data.error && Array.isArray(data.data)) {
          // Put major cities first if possible, but for simplicity just use the returned list
          setCities(data.data);
          setFormData(prev => ({ ...prev, city: data.data[0] }));
        }
      } catch (err) {
        console.error('Failed to load cities', err);
      } finally {
        setLoadingCities(false);
      }
    }
    fetchCities();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    date: '',
    time: '',
    address: '',
    city: 'Lahore',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!formData.title || !formData.budget || !formData.date || !formData.time) {
      alert("Please fill out all fields.");
      return;
    }
    
    try {
      const data = await submitBooking({
        // For custom jobs, pick a generic service_id from backend or use a hardcoded one
        service_id: '43dc8fe1-2ffa-42a8-8afa-6a15a393ee6a', // Deep Home Cleaning fallback ID for now
        scheduled_start: `${formData.date}T${formData.time}:00Z`,
        address_details: {
          area: formData.city,
          street: formData.address,
          house: 'Custom Job',
          description: formData.description,
          title: formData.title
        },
        estimated_amount: Number(formData.budget),
        payment_method: paymentMethod
      });
      
      if (paymentMethod === 'CASH') {
        alert('Custom job posted successfully! Technicians will be notified.');
        router.push('/dashboard');
      } else {
        setClientSecret(data.client_secret);
        setStep(5);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to post job');
    }
  };

  return (
    <div className="bg-canvas text-on-surface antialiased font-body-md min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_at_top,white,transparent_80%)] pointer-events-none opacity-60"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav />
        
        <main className="flex-1 max-w-3xl w-full mx-auto px-margin-x py-12">
          
          <div className="mb-12 text-center">
            <h1 className="font-display-md text-4xl font-bold mb-4">Post a Custom Job</h1>
            <p className="text-text-secondary">Describe what you need, set your budget, and let professionals come to you.</p>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-surface-variant -z-10 rounded-full"></div>
              <div 
                className="absolute left-0 top-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500" 
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
              
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  step >= i ? 'bg-primary text-on-primary shadow-lg shadow-primary/25' : 'bg-surface-high border-2 border-surface-variant text-text-secondary'
                }`}>
                  {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-high border border-border-soft rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Job Details</h2>
                    <p className="text-text-secondary">What do you need help with?</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Job Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Install 3 ceiling fans in living room" className="w-full px-4 py-3 bg-canvas border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-3">Category</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {CATEGORIES.map(cat => (
                          <button key={cat.id} onClick={() => setFormData(prev => ({...prev, category: cat.id}))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.category === cat.id ? 'bg-primary/10 border-primary text-primary' : 'bg-canvas border-border-soft text-text-secondary hover:border-primary/50'}`}>
                            <cat.icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Detailed Description</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe the issue, any specific tools required, or constraints..." className="w-full px-4 py-3 bg-canvas border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"></textarea>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Budget & Timing</h2>
                    <p className="text-text-secondary">When do you need it, and how much are you offering?</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Your Budget (PKR)</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">Rs.</div>
                        <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="5000" className="w-full pl-12 pr-4 py-3 bg-canvas border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                      </div>
                      <p className="text-xs text-text-secondary mt-2">Technicians can accept this price, or you might negotiate later.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Preferred Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-canvas border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Preferred Time</label>
                        <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-3 bg-canvas border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Location</h2>
                    <p className="text-text-secondary">Where should the technician go?</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">City</label>
                      <select name="city" value={formData.city} onChange={handleChange} disabled={loadingCities} className="w-full px-4 py-3 bg-canvas border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50">
                        {loadingCities ? (
                          <option value={formData.city}>Loading cities...</option>
                        ) : (
                          cities.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Full Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-text-secondary" />
                        <textarea name="address" value={formData.address} onChange={handleChange} rows={3} placeholder="House, Street, Area..." className="w-full pl-12 pr-4 py-3 bg-canvas border border-border-soft rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"></textarea>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <SparklesIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Review & Post</h2>
                    <p className="text-text-secondary">Does everything look correct?</p>
                  </div>

                  <div className="bg-canvas border border-border-soft rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-start border-b border-border-soft pb-4">
                      <div>
                        <h3 className="font-bold text-lg">{formData.title || 'Untitled Job'}</h3>
                        <p className="text-sm text-text-secondary">{CATEGORIES.find(c => c.id === formData.category)?.label || 'No Category'}</p>
                      </div>
                      <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                        Rs. {formData.budget || '0'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-secondary mb-1">Date & Time</p>
                        <p className="font-medium">{formData.date || 'Any Date'} at {formData.time || 'Any Time'}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary mb-1">Location</p>
                        <p className="font-medium">{formData.address || 'No Address'}, {formData.city}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-text-secondary mb-1 text-sm">Description</p>
                      <p className="font-medium text-sm leading-relaxed">{formData.description || 'No description provided.'}</p>
                    </div>
                    <div className="pt-2 border-t border-border-soft mt-4">
                      <p className="text-text-secondary mb-3 text-sm">Payment Method</p>
                      <div className="grid grid-cols-2 gap-4">
                        <label className={`cursor-pointer flex items-center p-4 border rounded-xl transition-all ${paymentMethod === 'CARD' ? 'border-primary bg-primary/5' : 'border-border-soft hover:border-primary/30'}`}>
                          <input type="radio" name="paymentMethod" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="hidden" />
                          <CreditCard className={`w-5 h-5 mr-3 ${paymentMethod === 'CARD' ? 'text-primary' : 'text-text-secondary'}`} />
                          <div className="font-medium">Pay via Card</div>
                        </label>
                        <label className={`cursor-pointer flex items-center p-4 border rounded-xl transition-all ${paymentMethod === 'CASH' ? 'border-primary bg-primary/5' : 'border-border-soft hover:border-primary/30'}`}>
                          <input type="radio" name="paymentMethod" value="CASH" checked={paymentMethod === 'CASH'} onChange={() => setPaymentMethod('CASH')} className="hidden" />
                          <Banknote className={`w-5 h-5 mr-3 ${paymentMethod === 'CASH' ? 'text-primary' : 'text-text-secondary'}`} />
                          <div className="font-medium">Cash on Site</div>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && clientSecret && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Secure Payment</h2>
                    <p className="text-text-secondary">Please enter your card details to confirm the booking.</p>
                  </div>
                  
                  <div className="bg-canvas border border-border-soft rounded-2xl p-6 shadow-sm">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm 
                        total={Number(formData.budget)} 
                        onSuccess={() => {
                          alert('Payment authorized and custom job posted successfully!');
                          router.push('/dashboard');
                        }} 
                      />
                    </Elements>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {step < 5 && (
              <div className="mt-12 flex justify-between items-center pt-6 border-t border-border-soft">
                {step > 1 ? (
                  <button onClick={handlePrev} className="px-6 py-3 border border-border-soft rounded-xl font-bold text-text-secondary hover:bg-surface-muted transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <Link href="/dashboard" className="px-6 py-3 border border-border-soft rounded-xl font-bold text-text-secondary hover:bg-surface-muted transition-colors">
                    Cancel
                  </Link>
                )}

                {step < 4 ? (
                  <button onClick={handleNext} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Posting...' : (paymentMethod === 'CARD' ? 'Proceed to Payment' : 'Post Job')} <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

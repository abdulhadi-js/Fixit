'use client';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';

export default function BookingSuccessPage() {
    return (
        <main className="flex-grow flex items-center justify-center px-margin-x">
            <div className="max-w-md w-full bg-surface-high border border-border-soft rounded-xl p-8 shadow-sm text-center">
                <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Booking Confirmed!</h1>
                <p className="font-body-md text-body-md text-text-secondary mb-8">
                    Your service has been successfully booked. A professional technician will be assigned to your job shortly.
                </p>
                
                <Link href="/dashboard" className="block w-full">
                    <Button fullWidth>
                        Go to Dashboard
                    </Button>
                </Link>
            </div>
        </main>
    );
}

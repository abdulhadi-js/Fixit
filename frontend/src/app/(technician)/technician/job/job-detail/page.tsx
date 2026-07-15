'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTechAgenda, useJobActions } from '../../../../../hooks/useTechAgenda';
import { StatusBadge } from '../../../../../components/ui/StatusBadge';
import { Button } from '../../../../../components/ui/Button';

function ActiveJobWorkspaceContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') as string;
    
    const { agenda, loading: agendaLoading } = useTechAgenda();
    const { updateStatus, loading: updateLoading, error: updateError, setError: setUpdateError } = useJobActions();
    
    const job = agenda.find(j => j.id === id);

    const handleStatusUpdate = async (newStatus: 'IN_PROGRESS' | 'COMPLETED') => {
        try {
            await updateStatus(id, newStatus);
            // In a real app we'd want to refetch the single job or the agenda,
            // but the page will re-render or we can just let it navigate/refresh.
            window.location.reload(); // Simple way to refresh data for now
        } catch (err: any) {
            // Error is handled by hook
        }
    };

    if (agendaLoading) {
        return <div className="p-8 text-center text-text-secondary">Loading job details...</div>;
    }

    if (!job) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-error-container text-on-error-container p-6 rounded-xl text-center">
                    <span className="material-symbols-outlined text-4xl mb-2">error</span>
                    <h2 className="font-headline-md mb-2">Job Not Found</h2>
                    <p>The job you are looking for does not exist or you don't have access.</p>
                    <Link href="/technician/dashboard" className="mt-4 inline-block text-primary hover:underline">Return to Dashboard</Link>
                </div>
            </div>
        );
    }

    const addressString = typeof job.address_details === 'string' 
        ? job.address_details 
        : `${job.address_details?.house}, ${job.address_details?.street}, ${job.address_details?.area}`;

    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`;

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col">
            <header className="mb-6 flex items-center gap-4">
                <Link href="/technician/dashboard" className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Active Workspace</h1>
                    <p className="font-body-md text-body-md text-secondary mt-1">Manage job execution and status</p>
                </div>
            </header>

            {updateError && (
                <div className="mb-6 bg-error-container text-on-error-container p-4 rounded-xl flex justify-between items-center">
                    <span>{updateError}</span>
                    <button onClick={() => setUpdateError('')}>
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow pb-8">
                {/* Job Details Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-surface-high border border-border-soft rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                        {job.status === 'IN_PROGRESS' && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        )}
                        
                        <div className="flex justify-between items-start mb-6 border-b border-border-soft pb-6">
                            <div>
                                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">{job.service?.title}</h2>
                                <p className="font-label-md text-label-md text-primary font-bold">Earn Rs. {job.estimated_amount || job.service?.base_price}</p>
                            </div>
                            <StatusBadge status={job.status} />
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0 text-text-secondary">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <div>
                                    <h3 className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-1">Customer</h3>
                                    <p className="font-headline-md text-headline-md text-on-surface">{job.consumer?.full_name}</p>
                                    <p className="font-body-md text-body-md text-text-secondary mt-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">call</span>
                                        {job.consumer?.phone_number}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0 text-text-secondary">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <div>
                                    <h3 className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-1">Scheduled Time</h3>
                                    <p className="font-body-md text-body-md text-on-surface">
                                        {new Date(job.scheduled_start).toLocaleString(undefined, { 
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
                                            hour: '2-digit', minute:'2-digit' 
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0 text-text-secondary">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-1">Service Address</h3>
                                    <p className="font-body-md text-body-md text-on-surface">{addressString}</p>
                                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline font-label-md text-label-md mt-2">
                                        <span className="material-symbols-outlined text-[16px]">directions</span>
                                        Open in Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Column */}
                <div className="flex flex-col gap-6">
                    <div className="bg-surface-high border border-border-soft rounded-xl p-6 shadow-sm sticky top-6">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Execution Status</h2>
                        
                        <div className="space-y-4">
                            {job.status === 'CONFIRMED' && (
                                <Button 
                                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                                    loading={updateLoading}
                                    fullWidth
                                >
                                    <span className="material-symbols-outlined mr-2">play_arrow</span>
                                    Start Repair Session
                                </Button>
                            )}
                            
                            {job.payment_method === 'CASH' && job.status === 'IN_PROGRESS' && (
                                <div className="bg-orange-100 text-orange-900 border border-orange-200 p-4 rounded-xl flex items-start gap-3 mb-4 shadow-sm">
                                    <span className="material-symbols-outlined text-orange-600">payments</span>
                                    <div>
                                        <p className="font-bold text-sm">Collect Cash Payment</p>
                                        <p className="text-xs mt-1">This is a Cash on Delivery booking. Please collect <strong>Rs. {job.estimated_amount || job.service?.base_price}</strong> from the customer before completing the job.</p>
                                    </div>
                                </div>
                            )}

                            {job.status === 'IN_PROGRESS' && (
                                <Button 
                                    onClick={() => handleStatusUpdate('COMPLETED')}
                                    loading={updateLoading}
                                    className="bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                                    fullWidth
                                >
                                    <span className="material-symbols-outlined mr-2">check_circle</span>
                                    Complete Job
                                </Button>
                            )}

                            {job.status === 'COMPLETED' && (
                                <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 p-4 rounded-lg flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">verified</span>
                                    <span className="font-label-md">Job Completed</span>
                                </div>
                            )}

                            {job.status === 'CANCELLED' && (
                                <div className="bg-error-container text-on-error-container p-4 rounded-lg flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">cancel</span>
                                    <span className="font-label-md">Job Cancelled</span>
                                </div>
                            )}
                        </div>
                        
                        <hr className="my-6 border-border-soft" />
                        
                        <p className="font-caption text-caption text-text-secondary text-center">
                            Ensure you log status updates accurately. Payment is released upon job completion.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ActiveJobWorkspace() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-text-secondary">Loading workspace...</div>}>
            <ActiveJobWorkspaceContent />
        </Suspense>
    );
}

'use client';
import Link from 'next/link';
import { useTechAgenda } from '../../../../hooks/useTechAgenda';
import { StatusBadge } from '../../../../components/ui/StatusBadge';

export default function TechnicianDashboardPage() {
    const { agenda, loading, error } = useTechAgenda();

    if (error) {
        return (
            <div className="max-w-container-max mx-auto p-4 md:p-8">
                <div className="bg-error-container text-on-error-container p-6 rounded-xl">
                    <h2 className="font-headline-md">Failed to load agenda</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const completedJobs = agenda.filter(j => j.status === 'COMPLETED').length;
    const estEarnings = agenda.filter(j => j.status === 'COMPLETED').reduce((acc, j) => acc + Number(j.service?.base_price || j.base_price || 0), 0);

    return (
        <div className="max-w-container-max mx-auto">
            <header className="mb-8">
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Today's Agenda</h1>
                <p className="font-body-md text-body-md text-secondary mt-1">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface-high border border-border-soft rounded-lg p-4 flex flex-col justify-center items-start shadow-sm">
                    <span className="font-caption text-caption text-secondary uppercase tracking-wider">Jobs Today</span>
                    {loading ? (
                        <div className="h-8 bg-surface-muted rounded w-1/2 mt-1 animate-pulse"></div>
                    ) : (
                        <span className="font-headline-md text-headline-md text-primary mt-1">{agenda.length}</span>
                    )}
                </div>
                <div className="bg-surface-high border border-border-soft rounded-lg p-4 flex flex-col justify-center items-start shadow-sm">
                    <span className="font-caption text-caption text-secondary uppercase tracking-wider">Completed</span>
                    {loading ? (
                        <div className="h-8 bg-surface-muted rounded w-1/2 mt-1 animate-pulse"></div>
                    ) : (
                        <span className="font-headline-md text-headline-md text-on-surface mt-1">{completedJobs}</span>
                    )}
                </div>
                <div className="bg-surface-high border border-border-soft rounded-lg p-4 flex flex-col justify-center items-start shadow-sm">
                    <span className="font-caption text-caption text-secondary uppercase tracking-wider">Est. Earnings</span>
                    {loading ? (
                        <div className="h-8 bg-surface-muted rounded w-1/2 mt-1 animate-pulse"></div>
                    ) : (
                        <span className="font-headline-md text-headline-md text-on-surface mt-1">Rs. {estEarnings}</span>
                    )}
                </div>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-surface-high border border-border-soft rounded-xl p-6 shadow-sm flex flex-col animate-pulse min-h-[220px]">
                            <div className="h-4 bg-surface-muted rounded w-1/4 mb-4"></div>
                            <div className="h-6 bg-surface-muted rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-surface-muted rounded w-full mb-2"></div>
                            <div className="h-4 bg-surface-muted rounded w-1/2 mb-auto"></div>
                            <div className="h-12 bg-surface-muted rounded w-full mt-6"></div>
                        </div>
                    ))
                ) : agenda.map(job => (
                    <article key={job.id} className={`bg-surface-high ${job.status === 'IN_PROGRESS' ? 'border-2 border-primary-container' : 'border border-border-soft'} rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden ${job.status === 'COMPLETED' ? 'opacity-60' : ''}`}>
                        {job.status === 'IN_PROGRESS' && <div className="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>}
                        
                        <div className={`flex justify-between items-start mb-4 ${job.status === 'IN_PROGRESS' ? 'pl-2' : ''}`}>
                            <div className={`flex items-center gap-2 ${job.status === 'IN_PROGRESS' ? 'text-primary-container font-bold' : 'text-secondary'} font-label-md text-label-md`}>
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                {new Date(job.scheduled_start || (job.scheduled_time ? job.scheduled_time.replace(/^\["([^"]+)".*$/, '$1') : new Date())).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <StatusBadge status={job.status} />
                        </div>
                        
                        <h3 className={`font-headline-md text-headline-md text-on-surface mb-2 ${job.status === 'IN_PROGRESS' ? 'pl-2' : ''}`}>{job.service?.title || job.service_title}</h3>
                        <div className={`flex items-start gap-2 text-secondary font-body-md text-body-md mb-6 flex-1 ${job.status === 'IN_PROGRESS' ? 'pl-2' : ''}`}>
                            <span className="material-symbols-outlined text-base mt-1">location_on</span>
                            <span>{typeof job.address_details === 'string' ? job.address_details : `${job.address_details?.house}, ${job.address_details?.street}, ${job.address_details?.area}`}</span>
                        </div>
                        
                        <Link href={`/technician/job/job-detail?id=${job.id}`} className={`w-full py-3 border border-border-soft rounded-lg font-label-md text-label-md flex justify-center items-center gap-2 transition-colors group ${job.status === 'IN_PROGRESS' ? 'text-primary hover:border-primary' : 'text-on-surface hover:border-primary hover:text-primary'}`}>
                            Open Workspace 
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </article>
                ))}
                
                {!loading && agenda.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-surface-high border border-border-soft rounded-xl text-text-secondary">
                        <span className="material-symbols-outlined text-4xl mb-2">work_off</span>
                        <p className="font-body-md">No jobs assigned for today.</p>
                        <Link href="/technician/job-board" className="mt-4 text-primary hover:underline font-label-md">
                            Browse Job Board
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

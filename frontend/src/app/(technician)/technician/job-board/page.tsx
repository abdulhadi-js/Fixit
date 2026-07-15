'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobBoard, useJobActions } from '../../../../hooks/useTechAgenda';
import { MapPin, Calendar, Clock, Filter, Search, CheckCircle2, Briefcase, AlertCircle } from 'lucide-react';

const CATEGORIES = ['ALL', 'ELECTRICAL', 'PLUMBING', 'HVAC', 'MAINTENANCE', 'CLEANING'];

function formatDate(scheduledTime: string | undefined) {
  if (!scheduledTime) return 'TBD';
  try {
    // Handle PostgreSQL tsrange format: ["2026-07-14T10:00:00","2026-07-14T11:00:00")
    const clean = scheduledTime.replace(/^\[?"?/, '').replace(/"?,.*$/, '');
    const d = new Date(clean);
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return scheduledTime;
  }
}

function formatTime(scheduledTime: string | undefined) {
  if (!scheduledTime) return 'TBD';
  try {
    const clean = scheduledTime.replace(/^\[?"?/, '').replace(/"?,.*$/, '');
    const d = new Date(clean);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatAddress(addressDetails: any) {
  if (!addressDetails) return 'Address not provided';
  if (typeof addressDetails === 'string') {
    try {
      const parsed = JSON.parse(addressDetails);
      return `${parsed.house || ''}, ${parsed.street || ''}, ${parsed.area || ''}`.replace(/^,\s*/, '');
    } catch {
      return addressDetails;
    }
  }
  return `${addressDetails.house || ''}, ${addressDetails.street || ''}, ${addressDetails.area || ''}`.replace(/^,\s*/, '');
}

export default function JobBoardPage() {
  const { jobs, loading, error, refetch } = useJobBoard();
  const { claim, loading: claiming } = useJobActions();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [claimError, setClaimError] = useState('');
  const router = useRouter();

  const filteredJobs = jobs.filter(job => {
    const categoryMatch = filter === 'ALL' || (job.service?.metadata?.category || '').toUpperCase() === filter;
    const searchMatch = !search || 
      (job.service?.title || '').toLowerCase().includes(search.toLowerCase()) ||
      formatAddress(job.address_details).toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleAccept = async (jobId: string) => {
    try {
      setClaimError('');
      setClaimedId(jobId);
      await claim(jobId);
      // Remove from the list and redirect to dashboard after short delay
      setTimeout(() => {
        refetch();
        router.push('/technician/dashboard');
      }, 1200);
    } catch (err: any) {
      setClaimedId(null);
      setClaimError(err.message || 'Failed to accept job. Please try again.');
    }
  };

  return (
    <div className="bg-canvas text-on-surface antialiased font-body-md min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_at_top,white,transparent_80%)] pointer-events-none opacity-60"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 max-w-7xl w-full mx-auto px-margin-x py-12 flex flex-col md:flex-row gap-8">

          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-surface-high border border-border-soft rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Category</label>
                  <div className="flex flex-col gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter === cat ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-muted text-text-secondary'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Job Feed */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h1 className="font-display-md text-3xl font-bold">Open Jobs</h1>
                <p className="text-text-secondary">Real-time customer service requests. Accept to add to your agenda.</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search jobs..."
                  className="w-full pl-9 pr-4 py-2 bg-surface-high border border-border-soft rounded-full text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Claim Error Banner */}
            <AnimatePresence>
              {claimError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{claimError}</span>
                  <button onClick={() => setClaimError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Skeleton */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-surface-high border border-border-soft rounded-2xl p-6 animate-pulse">
                    <div className="flex gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="h-3 bg-surface-muted rounded w-1/4"></div>
                        <div className="h-5 bg-surface-muted rounded w-3/4"></div>
                        <div className="h-3 bg-surface-muted rounded w-full"></div>
                        <div className="h-3 bg-surface-muted rounded w-1/2"></div>
                      </div>
                      <div className="w-32 space-y-3">
                        <div className="h-6 bg-surface-muted rounded"></div>
                        <div className="h-10 bg-surface-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="text-center py-12 bg-surface-high border border-border-soft rounded-2xl">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-text-secondary font-medium">{error}</p>
                <button onClick={refetch} className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:bg-accent-hover transition-colors">
                  Try Again
                </button>
              </div>
            )}

            {/* Job Cards */}
            {!loading && !error && (
              <div className="space-y-4">
                {filteredJobs.map((job, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    key={job.id}
                    className={`bg-surface-high border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${claimedId === job.id ? 'border-green-400 bg-green-50/30' : 'border-border-soft'}`}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">

                      {/* Left: Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold px-2 py-1 bg-surface-muted rounded-md text-text-secondary uppercase">
                            {job.service?.metadata?.category || 'SERVICE'}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {job.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{job.service?.title || 'Custom Job Request'}</h3>
                        {job.service?.metadata?.description && (
                          <p className="text-text-secondary text-sm mb-4 line-clamp-2">{job.service.metadata.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {formatAddress(job.address_details)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(job.scheduled_time)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(job.scheduled_time)}
                          </div>
                        </div>
                      </div>

                      {/* Right: Budget & Action */}
                      <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-border-soft pt-4 md:pt-0 md:pl-6 min-w-[160px]">
                        <div className="mb-4 md:mb-0">
                          <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Customer Budget</p>
                          <p className="text-2xl font-bold text-green-600">
                            Rs. {Number(job.estimated_amount || job.service?.base_price || 0).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAccept(job.id)}
                          disabled={!!claimedId || claiming}
                          className={`w-full px-4 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                            claimedId === job.id
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-primary text-on-primary hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                        >
                          {claimedId === job.id
                            ? <><CheckCircle2 className="w-4 h-4" /> Accepted! Redirecting...</>
                            : <><Briefcase className="w-4 h-4" /> Accept Job</>
                          }
                        </button>
                      </div>

                    </div>
                  </motion.div>
                ))}

                {filteredJobs.length === 0 && (
                  <div className="text-center py-16 bg-surface-high border border-border-soft rounded-2xl">
                    <Briefcase className="w-10 h-10 text-text-secondary mx-auto mb-3 opacity-40" />
                    <p className="text-text-secondary font-medium">No open jobs found.</p>
                    <p className="text-text-secondary text-sm mt-1">Check back soon — new jobs are posted in real time.</p>
                    <button onClick={refetch} className="mt-4 px-4 py-2 border border-border-soft rounded-lg text-sm hover:border-primary hover:text-primary transition-colors">
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}

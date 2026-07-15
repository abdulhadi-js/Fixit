'use client';
import { useEffect, useState } from 'react';
import { getTechnicianEarnings } from '../../../../lib/api/payments.api';

export default function EarningsPage() {
    const [earnings, setEarnings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);

    const handleWithdraw = () => {
        setWithdrawing(true);
        setTimeout(() => {
            alert('Withdrawal request submitted! Funds will arrive in your bank account in 2-3 business days.');
            setWithdrawing(false);
        }, 1500);
    };

    useEffect(() => {
        async function loadEarnings() {
            try {
                const data = await getTechnicianEarnings();
                setEarnings(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load earnings');
            } finally {
                setLoading(false);
            }
        }
        loadEarnings();
    }, []);

    if (error) {
        return (
            <div className="max-w-container-max mx-auto p-4 md:p-8">
                <div className="bg-error-container text-on-error-container p-6 rounded-xl">
                    <h2 className="font-headline-md">Failed to load earnings</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const weeklyEarnings = [
        { day: 'Mon', amount: 0 },
        { day: 'Tue', amount: 1500 },
        { day: 'Wed', amount: 3200 },
        { day: 'Thu', amount: 0 },
        { day: 'Fri', amount: 4500 },
        { day: 'Sat', amount: 7800 },
        { day: 'Sun', amount: 5000 },
    ];
    
    const maxEarning = Math.max(...weeklyEarnings.map(d => d.amount), 1);

    return (
        <div className="max-w-container-max mx-auto">
            <header className="mb-8">
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Earnings Ledger</h1>
                <p className="font-body-md text-body-md text-secondary mt-1">Track your income and completed jobs</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 bg-primary rounded-xl p-8 text-on-primary shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    <h2 className="font-label-md text-label-md opacity-80 mb-2 uppercase tracking-wider">Total Balance</h2>
                    {loading ? (
                        <div className="h-12 bg-white/20 rounded w-1/3 animate-pulse"></div>
                    ) : (
                        <div className="font-headline-lg text-5xl font-bold">Rs. {earnings?.balance || 0}</div>
                    )}
                    <button 
                        onClick={handleWithdraw}
                        disabled={withdrawing || !earnings?.balance}
                        className="mt-6 bg-white text-primary px-6 py-2.5 rounded-lg font-label-md text-label-md self-start hover:bg-surface-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {withdrawing ? (
                            <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Processing...</>
                        ) : 'Withdraw Funds'}
                    </button>
                </div>
                
                <div className="bg-surface-high border border-border-soft rounded-xl p-6 shadow-sm flex flex-col justify-center">
                    <h2 className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-2">Completed Jobs</h2>
                    {loading ? (
                        <div className="h-10 bg-surface-muted rounded w-1/4 animate-pulse"></div>
                    ) : (
                        <div className="font-headline-lg text-4xl text-on-surface font-bold">{earnings?.completed_jobs_count || 0}</div>
                    )}
                    <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                        <span className="material-symbols-outlined text-[18px] mr-1">trending_up</span>
                        +2 from last week
                    </div>
                </div>
            </div>

            <div className="bg-surface-high border border-border-soft rounded-xl p-6 shadow-sm mb-8">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Weekly Overview</h2>
                
                <div className="h-64 flex items-end justify-between gap-2 pt-4">
                    {weeklyEarnings.map((day) => {
                        const height = `${(day.amount / maxEarning) * 100}%`;
                        return (
                            <div key={day.day} className="flex flex-col items-center flex-1 group">
                                <div className="w-full relative flex justify-center items-end h-full min-h-[4px]">
                                    <div 
                                        className="w-full max-w-[40px] bg-primary/30 group-hover:bg-primary transition-colors rounded-t-sm"
                                        style={{ height: height === '0%' ? '4px' : height }}
                                    ></div>
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                                        Rs. {day.amount}
                                    </div>
                                </div>
                                <span className="text-caption font-caption text-secondary mt-3">{day.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="bg-surface-high border border-border-soft rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border-soft">
                    <h2 className="font-headline-md text-headline-md text-on-surface">Recent Transactions</h2>
                </div>
                <div className="p-12 text-center text-text-secondary flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl mb-3 text-border-soft">receipt_long</span>
                    <p className="font-body-md">Detailed transaction history will appear here once you complete jobs.</p>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../lib/types';
import { getAgenda, getUnassignedBookings, claimBooking, updateBookingStatus } from '../lib/api/bookings.api';

export function useTechAgenda() {
  const [agenda, setAgenda] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgenda();
  }, []);

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      const data = await getAgenda();
      setAgenda(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch agenda');
    } finally {
      setLoading(false);
    }
  };

  return { agenda, loading, error, refetch: fetchAgenda };
}

export function useJobBoard() {
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getUnassignedBookings();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch job board');
    } finally {
      setLoading(false);
    }
  };

  return { jobs, loading, error, refetch: fetchJobs };
}

export function useJobActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const claim = async (jobId: string) => {
    try {
      setLoading(true);
      setError('');
      return await claimBooking(jobId);
    } catch (err: any) {
      setError(err.message || 'Failed to claim job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (jobId: string, status: BookingStatus) => {
    try {
      setLoading(true);
      setError('');
      return await updateBookingStatus(jobId, status);
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { claim, updateStatus, loading, error, setError };
}

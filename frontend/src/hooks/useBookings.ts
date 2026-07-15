import { useState, useEffect } from 'react';
import { Booking } from '../lib/types';
import { getMyBookings, createBooking } from '../lib/api/bookings.api';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, refetch: fetchBookings };
}

export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitBooking = async (data: Parameters<typeof createBooking>[0]) => {
    try {
      setLoading(true);
      setError('');
      return await createBooking(data);
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitBooking, loading, error, setError };
}

export function useCompleteBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const completeJob = async (jobId: string) => {
    try {
      setLoading(true);
      setError('');
      const { completeBookingAsConsumer } = await import('../lib/api/bookings.api');
      return await completeBookingAsConsumer(jobId);
    } catch (err: any) {
      setError(err.message || 'Failed to mark job as complete');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { completeJob, loading, error, setError };
}

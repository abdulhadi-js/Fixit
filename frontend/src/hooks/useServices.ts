import { useState, useEffect } from 'react';
import { Service } from '../lib/types';
import { getServices, getServiceById } from '../lib/api/services.api';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error };
}

export function useService(id?: string) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchService(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchService = async (serviceId: string) => {
    try {
      setLoading(true);
      const data = await getServiceById(serviceId);
      setService(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch service details');
    } finally {
      setLoading(false);
    }
  };

  return { service, loading, error };
}

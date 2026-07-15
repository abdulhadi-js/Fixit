import { describe, it, expect } from 'vitest';

describe('Environment Configuration', () => {
  it('should have NEXT_PUBLIC_API_URL defined', () => {
    expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_API_URL).not.toBe('');
  });
});

describe('API URL Formatting', () => {
  it('should correctly construct an API path', () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const path = '/auth/login';
    const fullUrl = `${baseUrl}/api/v1${path}`;
    expect(fullUrl).toContain('/api/v1/auth/login');
  });

  it('should handle trailing slashes in base URL', () => {
    const baseUrl = 'http://localhost:3001/';
    const path = '/api/v1/auth/login';
    const fullUrl = baseUrl.replace(/\/$/, '') + path;
    expect(fullUrl).toBe('http://localhost:3001/api/v1/auth/login');
  });
});

describe('Business Logic', () => {
  it('should format price correctly', () => {
    const price = 1500;
    const formatted = `Rs. ${price.toLocaleString()}`;
    expect(formatted).toBe('Rs. 1,500');
  });

  it('should calculate total with tax', () => {
    const price = 1000;
    const taxRate = 0.05;
    const total = price + price * taxRate;
    expect(total).toBe(1050);
  });

  it('should validate phone number format', () => {
    const phoneRegex = /^(\+92|0)[0-9]{10}$/;
    expect(phoneRegex.test('+923001234567')).toBe(true);
    expect(phoneRegex.test('03001234567')).toBe(true);
    expect(phoneRegex.test('invalid')).toBe(false);
    expect(phoneRegex.test('123')).toBe(false);
  });

  it('should identify valid booking statuses', () => {
    const validStatuses = [
      'PENDING_PAYMENT',
      'CONFIRMED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
    ];
    expect(validStatuses).toContain('CONFIRMED');
    expect(validStatuses).toContain('COMPLETED');
    expect(validStatuses).not.toContain('UNKNOWN_STATUS');
  });

  it('should calculate technician earnings correctly', () => {
    const jobs = [
      { amount: 1000, status: 'COMPLETED' },
      { amount: 1500, status: 'COMPLETED' },
      { amount: 500, status: 'CANCELLED' },
    ];
    const totalEarnings = jobs
      .filter((j) => j.status === 'COMPLETED')
      .reduce((sum, j) => sum + j.amount, 0);
    expect(totalEarnings).toBe(2500);
  });
});

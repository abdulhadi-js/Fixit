import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── Mock the API client ─────────────────────────────────────────────────────
vi.mock('@/lib/api/client', () => ({
  apiRequest: vi.fn(),
}));

// ─── Mock localStorage ────────────────────────────────────────────────────────
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Authentication Utilities', () => {
  it('should return null when no token is stored', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { getToken } = await import('@/lib/auth');
    expect(getToken()).toBeNull();
  });

  it('should return the stored token when it exists', async () => {
    localStorageMock.getItem.mockReturnValue('test-jwt-token');
    const { getToken } = await import('@/lib/auth');
    expect(getToken()).toBe('test-jwt-token');
  });
});

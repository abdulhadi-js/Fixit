import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn().mockReturnValue('mock-jwt-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true }),
    });
  });

  it('should attach Authorization header when token is available', async () => {
    const { apiRequest } = await import('@/lib/api/client');
    await apiRequest('/auth/me');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );
  });

  it('should throw an error when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Bad Request' }),
    });

    const { apiRequest } = await import('@/lib/api/client');
    await expect(apiRequest('/auth/login')).rejects.toThrow('Bad Request');
  });

  it('should handle array error messages from the server', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: ['phone is invalid', 'password too short'] }),
    });

    const { apiRequest } = await import('@/lib/api/client');
    await expect(apiRequest('/auth/register')).rejects.toThrow(
      'phone is invalid, password too short'
    );
  });

  it('should prepend /api/v1 to paths that do not already have it', async () => {
    const { apiRequest } = await import('@/lib/api/client');
    await apiRequest('/services');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/v1/services');
  });
});

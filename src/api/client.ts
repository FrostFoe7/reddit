/**
 * Centralized API Client with timeout, error handling, and interceptors
 * Provides type-safe, consistent API communication
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/proxy/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ApiError extends Error {
  statusCode?: number;
  originalError?: unknown;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string | null } };
    return parsed?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

function buildHeaders(config?: RequestConfig, includeJsonContentType: boolean = true): Record<string, string> {
  const headers: Record<string, string> = {
    ...(includeJsonContentType ? { 'Content-Type': 'application/json' } : {}),
    ...(config?.headers ?? {}),
  };

  const token = getAccessToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Normalize error response from API
 */
function parseApiError(response: Response, body: unknown): ApiError {
  const error = new Error() as ApiError;
  error.statusCode = response.status;

  if (typeof body === 'object' && body !== null && 'error' in body) {
    error.message = (body as Record<string, unknown>).error as string;
  } else {
    error.message = `HTTP ${response.status}: ${response.statusText}`;
  }

  error.originalError = body;
  return error;
}

/**
 * Generic fetch wrapper with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & RequestConfig = {},
): Promise<Response> {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse response body safely
 */
async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new Error(`Invalid response type: ${contentType}`);
  }
  return response.json();
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw parseApiError(response, body);
  }

  // Handle wrapped response format { data: ... } or { error: ... }
  if (typeof body === 'object' && body !== null) {
    const wrappedBody = body as Record<string, unknown>;
    if ('data' in wrappedBody) {
      return wrappedBody.data as T;
    }
    if ('error' in wrappedBody) {
      throw parseApiError(response, body);
    }
  }

  return body as T;
}

/**
 * Main API Client
 */
export const api = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = `${BASE_URL}/${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: buildHeaders(config),
      timeout: config?.timeout,
    });
    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: unknown, config?: RequestConfig): Promise<T> {
    const url = `${BASE_URL}/${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: buildHeaders(config),
      body: JSON.stringify(data),
      timeout: config?.timeout,
    });
    return handleResponse<T>(response);
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: unknown, config?: RequestConfig): Promise<T> {
    const url = `${BASE_URL}/${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'PUT',
      headers: buildHeaders(config),
      body: JSON.stringify(data),
      timeout: config?.timeout,
    });
    return handleResponse<T>(response);
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = `${BASE_URL}/${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      headers: buildHeaders(config),
      timeout: config?.timeout,
    });
    return handleResponse<T>(response);
  },

  /**
   * Multipart/form-data POST request (for media uploads)
   */
  async postForm<T>(endpoint: string, data: FormData, config?: RequestConfig): Promise<T> {
    const url = `${BASE_URL}/${endpoint}`;
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: buildHeaders(config, false),
      body: data,
      timeout: config?.timeout,
    });
    return handleResponse<T>(response);
  },
};

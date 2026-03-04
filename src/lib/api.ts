/**
 * Simple Fetch-based API Client
 * Works with the /proxy/api proxy in Vite and production cPanel paths
 */

const BASE_URL = '/proxy/api';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    return handleResponse(response);
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

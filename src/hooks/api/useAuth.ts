/**
 * Auth Hooks
 * Handle login/register logic
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type ApiError } from '@/api/client';
import { normalizeUser } from '@/types/normalize';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

/**
 * Register new user
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: { username: string; email: string; password: string }) => {
      const data = await api.post<Record<string, unknown>>('auth/register', credentials, {
        timeout: 15000,
      });
      const payload = data as Record<string, unknown>;
      return {
        user: normalizeUser(payload.user as Record<string, unknown>),
        accessToken: (payload.token as string | undefined) ?? null,
        refreshToken: (payload.refresh_token as string | undefined) ?? null,
      };
    },
    onSuccess: result => {
      login(result.user, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      queryClient.setQueryData(['auth', 'currentUser'], result.user);
      toast.success('Account created successfully!');
    },
    onError: (error: ApiError) => {
      console.error('Register error:', error);
      toast.error(error.message || 'Registration failed');
    },
  });
}

/**
 * Login user
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const data = await api.post<Record<string, unknown>>('auth/login', credentials, {
        timeout: 15000,
      });
      const payload = data as Record<string, unknown>;
      return {
        user: normalizeUser(payload.user as Record<string, unknown>),
        accessToken: (payload.token as string | undefined) ?? null,
        refreshToken: (payload.refresh_token as string | undefined) ?? null,
      };
    },
    onSuccess: result => {
      login(result.user, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      queryClient.setQueryData(['auth', 'currentUser'], result.user);
      toast.success('Logged in successfully!');
    },
    onError: (error: ApiError) => {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    },
  });
}

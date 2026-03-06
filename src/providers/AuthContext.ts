import { createContext } from 'react';
import type { User } from '@/types';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: User, tokens?: { accessToken?: string | null; refreshToken?: string | null }) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setTokens: (tokens: { accessToken?: string | null; refreshToken?: string | null }) => void;
  requireAuth: (redirectTo?: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

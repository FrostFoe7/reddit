import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useStore';
import { AuthContext, type AuthContextValue } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    accessToken,
    refreshToken,
    login,
    logout: logoutStore,
    updateUser,
    setTokens,
  } = useAuthStore();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      accessToken,
      refreshToken,
      login,
      updateUser,
      setTokens,
      logout: () => {
        logoutStore();
        navigate('/auth/login', { replace: true });
      },
      requireAuth: (redirectTo = '/auth/login') => {
        if (!isAuthenticated) {
          navigate(redirectTo, { replace: true });
          return false;
        }
        return true;
      },
    }),
    [user, isAuthenticated, accessToken, refreshToken, login, updateUser, setTokens, logoutStore, navigate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: User, tokens?: { accessToken?: string | null; refreshToken?: string | null }) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setTokens: (tokens: { accessToken?: string | null; refreshToken?: string | null }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      login: (user, tokens) =>
        set({
          user,
          isAuthenticated: true,
          accessToken: tokens?.accessToken ?? null,
          refreshToken: tokens?.refreshToken ?? null,
        }),
      logout: () => set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null }),
      updateUser: updatedUser =>
        set(state => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      setTokens: tokens =>
        set(state => ({
          accessToken: tokens.accessToken ?? state.accessToken,
          refreshToken: tokens.refreshToken ?? state.refreshToken,
        })),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Overlay management
  shareModal: { isOpen: boolean; url: string };
  reportModal: { isOpen: boolean; targetId: string };
  lightbox: { isOpen: boolean; imageUrl: string };

  openShare: (url: string) => void;
  closeShare: () => void;
  openReport: (targetId: string) => void;
  closeReport: () => void;
  openLightbox: (imageUrl: string) => void;
  closeLightbox: () => void;
}

export const useUIStore = create<UIState>(set => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),

  shareModal: { isOpen: false, url: '' },
  reportModal: { isOpen: false, targetId: '' },
  lightbox: { isOpen: false, imageUrl: '' },

  openShare: url => set({ shareModal: { isOpen: true, url } }),
  closeShare: () => set({ shareModal: { isOpen: false, url: '' } }),

  openReport: targetId => set({ reportModal: { isOpen: true, targetId } }),
  closeReport: () => set({ reportModal: { isOpen: false, targetId: '' } }),

  openLightbox: imageUrl => set({ lightbox: { isOpen: true, imageUrl } }),
  closeLightbox: () => set({ lightbox: { isOpen: false, imageUrl: '' } }),
}));

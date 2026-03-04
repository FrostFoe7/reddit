import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
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

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  shareModal: { isOpen: false, url: '' },
  reportModal: { isOpen: false, targetId: '' },
  lightbox: { isOpen: false, imageUrl: '' },

  openShare: (url) => set({ shareModal: { isOpen: true, url } }),
  closeShare: () => set({ shareModal: { isOpen: false, url: '' } }),
  
  openReport: (targetId) => set({ reportModal: { isOpen: true, targetId } }),
  closeReport: () => set({ reportModal: { isOpen: false, targetId: '' } }),
  
  openLightbox: (imageUrl) => set({ lightbox: { isOpen: true, imageUrl } }),
  closeLightbox: () => set({ lightbox: { isOpen: false, imageUrl: '' } }),
}));

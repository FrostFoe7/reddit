import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAuthStore } from '@/store/useStore';

// Lazy load pages for better bundle splitting
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const PostPage = lazy(() => import('@/pages/posts/PostPage').then(m => ({ default: m.PostPage })));
const SubredditPage = lazy(() =>
  import('@/pages/community/SubredditPage').then(m => ({ default: m.SubredditPage })),
);
const ProfilePage = lazy(() =>
  import('@/pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })),
);
const CreatePostPage = lazy(() =>
  import('@/pages/posts/CreatePostPage').then(m => ({ default: m.CreatePostPage })),
);
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })));
const NotificationsPage = lazy(() =>
  import('@/pages/notifications/NotificationsPage').then(m => ({
    default: m.NotificationsPage,
  })),
);
const MessagesPage = lazy(() =>
  import('@/pages/messages/MessagesPage').then(m => ({ default: m.MessagesPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })),
);
const CommunityCreatePage = lazy(() =>
  import('@/pages/community/CommunityCreatePage').then(m => ({ default: m.CommunityCreatePage })),
);
const UserEditProfilePage = lazy(() =>
  import('@/pages/profile/UserEditProfilePage').then(m => ({ default: m.UserEditProfilePage })),
);
const PostEditPage = lazy(() =>
  import('@/pages/posts/PostEditPage').then(m => ({ default: m.PostEditPage })),
);
const CommunitySettingsPage = lazy(() =>
  import('@/pages/community/CommunitySettingsPage').then(m => ({ default: m.CommunitySettingsPage })),
);
const ModeratorPage = lazy(() =>
  import('@/pages/community/ModeratorPage').then(m => ({ default: m.ModeratorPage })),
);
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.default })));
const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then(m => ({ default: m.default })),
);
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-[3px] border-muted border-t-primary rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth/login' || location.pathname === '/auth/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
          </Routes>
        </Suspense>
      </div>
    );
  }

  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/r/:name" element={<SubredditPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route
            path="/posts/create"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/r/create"
            element={
              <ProtectedRoute>
                <CommunityCreatePage />
              </ProtectedRoute>
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/explore" element={<SearchPage />} />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <UserEditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/edit/:id"
            element={
              <ProtectedRoute>
                <PostEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/r/settings/:subreddit"
            element={
              <ProtectedRoute>
                <CommunitySettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/r/mod/:subreddit"
            element={
              <ProtectedRoute>
                <ModeratorPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Router>
            <AppContent />
          </Router>
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

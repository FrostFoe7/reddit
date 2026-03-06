import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary, PageTransition } from '@/components/common';
import { useAuth } from '@/hooks';
import { AuthProvider, ThemeProvider } from '@/providers';

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
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/auth/login"
                element={
                  <PageTransition>
                    <LoginPage />
                  </PageTransition>
                }
              />
              <Route
                path="/auth/register"
                element={
                  <PageTransition>
                    <RegisterPage />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    );
  }

  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <PageTransition>
                  <PostPage />
                </PageTransition>
              }
            />
            <Route
              path="/r/:name"
              element={
                <PageTransition>
                  <SubredditPage />
                </PageTransition>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              }
            />
            <Route
              path="/posts/create"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CreatePostPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/r/create"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CommunityCreatePage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PageTransition>
                  <SearchPage />
                </PageTransition>
              }
            />
            <Route
              path="/explore"
              element={
                <PageTransition>
                  <SearchPage />
                </PageTransition>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <NotificationsPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <MessagesPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <SettingsPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <UserEditProfilePage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/edit/:id"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <PostEditPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/r/settings/:subreddit"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CommunitySettingsPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/:communityName"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CommunitySettingsPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/r/mod/:subreddit"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <ModeratorPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </MainLayout>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Router>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </Router>
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Lazy load pages for better bundle splitting
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const PostPage = lazy(() => import('@/pages/PostPage').then(m => ({ default: m.PostPage })));
const SubredditPage = lazy(() =>
  import('@/pages/SubredditPage').then(m => ({ default: m.SubredditPage })),
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })),
);
const CreatePostPage = lazy(() =>
  import('@/pages/CreatePostPage').then(m => ({ default: m.CreatePostPage })),
);
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })));
const NotificationsPage = lazy(() =>
  import('@/pages/NotificationsPage').then(m => ({
    default: m.NotificationsPage,
  })),
);
const MessagesPage = lazy(() =>
  import('@/pages/MessagesPage').then(m => ({ default: m.MessagesPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })),
);
const LoginPage = lazy(() => import('@/pages/(auth)/Login').then(m => ({ default: m.default })));
const RegisterPage = lazy(() =>
  import('@/pages/(auth)/Register').then(m => ({ default: m.default })),
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
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/r/:name" element={<SubredditPage />} />
          <Route path="/u/:username" element={<ProfilePage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
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

import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

// Lazy load pages for better bundle splitting
const Home = lazy(() =>
  import("@/pages/Home").then((m) => ({ default: m.Home })),
);
const PostPage = lazy(() =>
  import("@/pages/PostPage").then((m) => ({ default: m.PostPage })),
);
const SubredditPage = lazy(() =>
  import("@/pages/SubredditPage").then((m) => ({ default: m.SubredditPage })),
);
const ProfilePage = lazy(() =>
  import("@/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const CreatePostPage = lazy(() =>
  import("@/pages/CreatePostPage").then((m) => ({ default: m.CreatePostPage })),
);
const SearchPage = lazy(() =>
  import("@/pages/SearchPage").then((m) => ({ default: m.SearchPage })),
);
const NotificationsPage = lazy(() =>
  import("@/pages/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const MessagesPage = lazy(() =>
  import("@/pages/MessagesPage").then((m) => ({ default: m.MessagesPage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const NotFound = lazy(() =>
  import("@/pages/NotFound").then((m) => ({ default: m.NotFound })),
);

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-[3px] border-muted border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;

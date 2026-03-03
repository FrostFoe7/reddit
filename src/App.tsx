import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Home } from '@/pages/Home';
import { PostPage } from '@/pages/PostPage';
import { SubredditPage } from '@/pages/SubredditPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { CreatePostPage } from '@/pages/CreatePostPage';
import { SearchPage } from '@/pages/SearchPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <MainLayout>
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
      </MainLayout>
    </Router>
  );
}

export default App;

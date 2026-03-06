import type { Post, Community, User as UserType } from '@/types';
import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, MessageCircle, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCommunities, usePosts, useUsers } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: posts = [] } = usePosts();
  const { data: communities = [] } = useCommunities();
  const { data: profiles = [] } = useUsers();

  // Context detection (Subreddit or Profile)
  const isSubreddit =
    location.pathname.startsWith('/r/') && !location.pathname.includes('/r/popular');
  const subName = isSubreddit ? location.pathname.split('/')[2] : null;

  const isProfile = location.pathname.startsWith('/u/');
  const profileName = isProfile ? location.pathname.split('/')[2] : null;

  const [searchInContext, setSearchInContext] = useState(true);
  const [lastPathname, setLastPathname] = useState(location.pathname);

  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setSearchInContext(true);
  }

  // Filter logic
  const filteredQueries =
    query.length > 0
      ? posts.filter((p: Post) => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
      : [];

  const filteredCommunities =
    query.length > 0
      ? communities
          .filter((c: Community) => c.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 3)
      : [];

  const filteredProfiles =
    query.length > 0
      ? profiles
          .filter((p: UserType) => (p.username || '').toLowerCase().includes(query.toLowerCase()))
          .slice(0, 4)
      : [];

  const hasResults =
    filteredQueries.length > 0 || filteredCommunities.length > 0 || filteredProfiles.length > 0;

  const highlightMatch = (text: string, match: string) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match})`, 'gi'));
    return (
      <span className="text-sm">
        {parts.map((part, i) =>
          part.toLowerCase() === match.toLowerCase() ? (
            <span key={i} className="font-normal opacity-70">
              {part}
            </span>
          ) : (
            <span key={i} className="font-semibold">
              {part}
            </span>
          ),
        )}
      </span>
    );
  };

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      let url = `/search?q=${encodeURIComponent(query)}`;
      if (searchInContext) {
        if (subName) url += `&sub=${subName}`;
        else if (profileName) url += `&user=${profileName}`;
      }
      navigate(url);
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPlaceholder = () => {
    if (searchInContext) {
      if (subName) return `Search in r/${subName}`;
      if (profileName) return `Search in u/${profileName}`;
    }
    return 'Find anything';
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl">
      <div
        className={cn(
          'flex items-center w-full bg-secondary hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full h-10 px-4 transition-all duration-200 border border-transparent focus-within:bg-background focus-within:border-border focus-within:shadow-sm',
          isFocused && hasResults && 'rounded-b-none shadow-lg',
        )}
      >
        <Search size={18} className="text-muted-foreground mr-2 shrink-0" />

        <div className="flex items-center flex-1 h-full min-w-0">
          {searchInContext && (subName || profileName) && !query && (
            <Badge
              variant="secondary"
              className="mr-2 h-7 gap-1.5 pl-1 pr-1 font-semibold text-xs bg-background border-border shrink-0 animate-in fade-in zoom-in duration-200"
            >
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white overflow-hidden">
                {subName ? 'r/' : 'u/'}
              </div>
              <span className="max-w-[100px] truncate">
                {subName ? `r/${subName}` : `u/${profileName}`}
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setSearchInContext(false);
                }}
                className="hover:bg-muted rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </Badge>
          )}

          <form onSubmit={handleSearch} className="flex-1 h-full">
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full h-full bg-transparent border-none outline-none text-sm font-medium placeholder:text-muted-foreground"
            />
          </form>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full transition-colors"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          )}

          <div className="w-[1px] h-6 bg-border mx-1" />

          <button
            className="flex items-center gap-1.5 px-3 h-8 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full transition-colors text-primary text-sm font-bold"
            onClick={() => navigate(`/search?q=${encodeURIComponent(query)}&type=ask`)}
          >
            <MessageCircle size={16} className="fill-current opacity-80" />
            <span>Ask</span>
          </button>
        </div>
      </div>

      {isFocused && hasResults && (
        <div className="absolute top-full left-0 right-0 bg-background border border-t-0 border-border rounded-b-[20px] shadow-xl z-50 overflow-hidden py-2 max-h-[80vh] overflow-y-auto">
          {/* Queries Section */}
          <div className="flex flex-col">
            {filteredQueries.map((q: Post) => (
              <button
                key={q.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                onClick={() => {
                  setQuery(q.title);
                  handleSearch();
                }}
              >
                <Search size={18} className="text-muted-foreground shrink-0" />
                <span className="truncate text-secondary-foreground">
                  {highlightMatch(q.title, query)}
                </span>
              </button>
            ))}
          </div>

          {/* Communities Section */}
          {filteredCommunities.length > 0 && (
            <div className="mt-1">
              <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Communities
              </div>
              {filteredCommunities.map((c: Community) => (
                <button
                  key={c.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors w-full text-left"
                  onClick={() => navigate(`/r/${c.id}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 relative',
                        c.icon_url || c.icon,
                      )}
                    >
                      <Users size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate">r/{c.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.members || 0} members
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Profiles Section */}
          {filteredProfiles.length > 0 && (
            <div className="mt-1">
              <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Profiles
              </div>
              {filteredProfiles.map((p: UserType) => (
                <button
                  key={p.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors w-full text-left"
                  onClick={() => navigate(`/u/${p.username}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={p.avatar_url || p.avatar} />
                      <AvatarFallback>
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate">u/{p.username}</span>
                      <span className="text-xs text-muted-foreground">{p.karma || 0} karma</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

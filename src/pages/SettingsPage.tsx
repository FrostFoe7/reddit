import React from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useStore';
import { useUpdateUser } from '@/hooks';

type UserSettings = {
  reduceMotion: boolean;
  compactMode: boolean;
  allowFollowers: boolean;
  contentVisibility: boolean;
};

function parseSettings(raw: unknown): UserSettings {
  if (!raw) {
    return {
      reduceMotion: false,
      compactMode: false,
      allowFollowers: true,
      contentVisibility: true,
    };
  }

  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }
  const record = parsed as Partial<UserSettings>;

  return {
    reduceMotion: Boolean(record.reduceMotion),
    compactMode: Boolean(record.compactMode),
    allowFollowers: record.allowFollowers ?? true,
    contentVisibility: record.contentVisibility ?? true,
  };
}

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore(state => state.user);
  const { mutate: updateUser, isPending } = useUpdateUser();

  const initialSettings = React.useMemo(() => parseSettings(user?.settings), [user?.settings]);
  const [settings, setSettings] = React.useState<UserSettings>(initialSettings);

  React.useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const persistSettings = (nextSettings: UserSettings) => {
    if (!user) return;

    setSettings(nextSettings);
    updateUser({ settings: nextSettings });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">Please login to manage settings</h2>
      </div>
    );
  }

  return (
    <div
      id="view-settings"
      className="view-section active px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="mb-8">
        <h1 className="text-3xl sm:text-3xl font-bold text-foreground tracking-tight">Settings</h1>
      </div>

      <div className="space-y-10 max-w-2xl">
        <section>
          <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2 opacity-70">
            Appearance
          </h2>
          <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border shadow-sm">
            <div
              className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-base sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  Dark Mode
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  Use dark theme across the app
                </span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={checked => setTheme(checked ? 'dark' : 'light')}
                className="scale-110"
              />
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex flex-col gap-0.5">
                <span className="text-base sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  Reduce Motion
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  Minimize animations for better accessibility
                </span>
              </div>
              <Switch
                className="scale-110"
                checked={settings.reduceMotion}
                onCheckedChange={checked =>
                  persistSettings({
                    ...settings,
                    reduceMotion: checked,
                  })
                }
              />
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex flex-col gap-0.5">
                <span className="text-base sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  Compact Mode
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  Fit more content on the screen
                </span>
              </div>
              <Switch
                className="scale-110"
                checked={settings.compactMode}
                onCheckedChange={checked =>
                  persistSettings({
                    ...settings,
                    compactMode: checked,
                  })
                }
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2 opacity-70">
            Privacy & Security
          </h2>
          <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border shadow-sm">
            <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex flex-col gap-0.5">
                <span className="text-base sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  Allow followers
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  People can follow you and see your posts
                </span>
              </div>
              <Switch
                className="scale-110"
                checked={settings.allowFollowers}
                onCheckedChange={checked =>
                  persistSettings({
                    ...settings,
                    allowFollowers: checked,
                  })
                }
              />
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex flex-col gap-0.5">
                <span className="text-base sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  Content Visibility
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  Show your posts in search results
                </span>
              </div>
              <Switch
                className="scale-110"
                checked={settings.contentVisibility}
                onCheckedChange={checked =>
                  persistSettings({
                    ...settings,
                    contentVisibility: checked,
                  })
                }
              />
            </div>
          </div>
        </section>

        <section className="pb-12 px-2">
          <Button
            variant="outline"
            disabled={isPending || !user}
            className="w-full sm:w-auto rounded-full font-bold h-12 px-8 shadow-md transition-all active:scale-95 mr-0 sm:mr-3 mb-3 sm:mb-0"
            onClick={() => persistSettings(settings)}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-auto rounded-full font-bold h-12 px-8 shadow-md transition-all active:scale-95"
          >
            Delete Account
          </Button>
          <p className="text-xs text-muted-foreground mt-4 font-medium leading-relaxed">
            Deleting your account is permanent and cannot be undone. All your posts and comments
            will be anonymized.
          </p>
        </section>
      </div>
    </div>
  );
};

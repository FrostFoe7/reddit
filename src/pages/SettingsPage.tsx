import React from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div id="view-settings" className="view-section active px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-foreground tracking-tight">Settings</h1>
      </div>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Appearance</h2>
          <div className="bg-card border border-border rounded-[24px] overflow-hidden divide-y divide-border shadow-sm">
            <div 
              className="p-5 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <div className="flex flex-col">
                <span className="text-[17px] font-semibold text-foreground mb-0.5">Dark Mode</span>
                <span className="text-[14px] text-muted-foreground font-medium">Toggle system theme</span>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
            <div className="p-5 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer">
              <div className="flex flex-col">
                <span className="text-[17px] font-semibold text-foreground mb-0.5">Reduce Motion</span>
                <span className="text-[14px] text-muted-foreground font-medium">Minimize animations</span>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

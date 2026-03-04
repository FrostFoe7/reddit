import React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      id="view-settings"
      className="view-section active px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-foreground tracking-tight">
          Settings
        </h1>
      </div>

      <div className="space-y-10 max-w-2xl">
        <section>
          <h2 className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2 opacity-70">
            Appearance
          </h2>
          <div className="bg-card border border-border rounded-[24px] overflow-hidden divide-y divide-border shadow-sm">
            <div
              className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[16px] sm:text-[17px] font-bold text-foreground group-hover:text-primary transition-colors">
                  Dark Mode
                </span>
                <span className="text-[14px] text-muted-foreground font-medium">
                  Use dark theme across the app
                </span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                className="scale-110"
              />
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex flex-col gap-0.5">
                <span className="text-[16px] sm:text-[17px] font-bold text-foreground group-hover:text-primary transition-colors">
                  Reduce Motion
                </span>
                <span className="text-[14px] text-muted-foreground font-medium">
                  Minimize animations for better accessibility
                </span>
              </div>
              <Switch className="scale-110" />
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex flex-col gap-0.5">
                <span className="text-[16px] sm:text-[17px] font-bold text-foreground group-hover:text-primary transition-colors">
                  Compact Mode
                </span>
                <span className="text-[14px] text-muted-foreground font-medium">
                  Fit more content on the screen
                </span>
              </div>
              <Switch className="scale-110" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2 opacity-70">
            Privacy & Security
          </h2>
          <div className="bg-card border border-border rounded-[24px] overflow-hidden divide-y divide-border shadow-sm">
            <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex flex-col gap-0.5">
                <span className="text-[16px] sm:text-[17px] font-bold text-foreground group-hover:text-primary transition-colors">
                  Allow followers
                </span>
                <span className="text-[14px] text-muted-foreground font-medium">
                  People can follow you and see your posts
                </span>
              </div>
              <Switch defaultChecked className="scale-110" />
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex flex-col gap-0.5">
                <span className="text-[16px] sm:text-[17px] font-bold text-foreground group-hover:text-primary transition-colors">
                  Content Visibility
                </span>
                <span className="text-[14px] text-muted-foreground font-medium">
                  Show your posts in search results
                </span>
              </div>
              <Switch defaultChecked className="scale-110" />
            </div>
          </div>
        </section>

        <section className="pb-12 px-2">
          <Button
            variant="destructive"
            className="w-full sm:w-auto rounded-full font-bold h-12 px-8 shadow-md transition-all active:scale-95"
          >
            Delete Account
          </Button>
          <p className="text-[12px] text-muted-foreground mt-4 font-medium leading-relaxed">
            Deleting your account is permanent and cannot be undone. All your
            posts and comments will be anonymized.
          </p>
        </section>
      </div>
    </div>
  );
};

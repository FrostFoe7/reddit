import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useStore";
import { toast } from "sonner";
import { X, ArrowLeft } from "lucide-react";
import type { User } from "@/types";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<{ success: boolean; user: User }>("auth/register", {
        username,
        email,
        password,
      });

      if (response.success) {
        login(response.user);
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed. Try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      {/* Modal Style Container */}
      <div className="bg-card w-full max-w-[440px] flex flex-col basis-full font-sans pointer-events-auto rounded-[20px] shadow-ios-float overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="flex justify-between items-center pt-6 pb-2 px-6">
          <div className="inline-flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-muted-foreground" />
            </button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
               <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm3.9 12.1a1.2 1.2 0 0 1-1.7 1.7 4.2 4.2 0 0 0-4.4 0 1.2 1.2 0 0 1-1.7-1.7 6.6 6.6 0 0 1 7.8 0z" />
               </svg>
            </div>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col py-2 px-8">
          <h1 className="text-2xl font-bold tracking-tight">Sign Up</h1>
          <p className="text-[15px] text-muted-foreground mt-1">
            Create an account to join the community.
          </p>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex flex-col grow shrink overflow-y-auto py-6 px-8 space-y-4 max-h-[60vh] no-scrollbar">
          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="u/username"
                className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Confirm
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
          
          <div className="text-[13px] text-muted-foreground leading-relaxed">
             By continuing, you agree to our User Agreement and Privacy Policy. You may receive email updates from us.
          </div>
        </div>

        {/* Footer / Primary Button */}
        <div className="flex flex-col p-8 pt-4 space-y-4 border-t border-border/50">
          <Button 
            type="submit" 
            form="register-form"
            className="w-full h-12 rounded-full font-bold text-base" 
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
          
          <div className="text-sm text-center font-medium">
            Already a redditor?{" "}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

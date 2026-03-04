import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  active?: boolean;
  className?: string;
}

export const SidebarNavItem = ({ to, icon: Icon, label, badge, active, className }: SidebarNavItemProps) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center justify-between px-4 py-2 rounded-[8px] transition-colors group",
      active ? "bg-muted text-foreground" : "text-foreground hover:bg-muted",
      className
    )}
  >
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 shrink-0">
        <Icon size={20} className={cn(!active && "text-foreground group-hover:text-foreground")} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={cn("text-[14px] font-medium truncate", active && "font-bold")}>{label}</span>
    </div>
    {badge && <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0 rounded-[4px] border-none">{badge}</Badge>}
  </Link>
);

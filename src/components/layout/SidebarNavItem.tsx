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
  collapsed?: boolean;
}

export const SidebarNavItem = ({
  to,
  icon: Icon,
  label,
  badge,
  active,
  className,
  collapsed,
}: SidebarNavItemProps) => (
  <Link
    to={to}
    className={cn(
      'flex items-center rounded-lg transition-colors group',
      collapsed ? 'justify-center w-10 h-10 p-0 mx-auto' : 'justify-between px-4 py-2',
      active ? 'bg-muted text-foreground' : 'text-foreground hover:bg-muted',
      className,
    )}
  >
    <div className={cn('flex items-center', collapsed ? 'gap-0' : 'gap-3')}>
      <div className="flex items-center justify-center w-8 h-8 shrink-0">
        <Icon
          size={20}
          className={cn(!active && 'text-foreground group-hover:text-foreground')}
          strokeWidth={active ? 2.5 : 2}
        />
      </div>
      {!collapsed && (
        <span className={cn('text-sm font-medium truncate', active && 'font-bold')}>{label}</span>
      )}
    </div>
    {!collapsed && badge && (
      <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0 rounded border-none">
        {badge}
      </Badge>
    )}
  </Link>
);

/* eslint-disable react-refresh/only-export-components */
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex items-center justify-center text-muted-foreground group-data-[orientation=vertical]/tabs:flex-col',
  {
    variants: {
      variant: {
        default:
          'rounded-lg bg-muted p-[3px] group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit',
        line: 'rounded-none bg-transparent p-0 border-b border-border group-data-[orientation=horizontal]/tabs:h-auto group-data-[orientation=vertical]/tabs:h-full group-data-[orientation=vertical]/tabs:border-b-0 group-data-[orientation=vertical]/tabs:border-r',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'relative inline-flex flex-1 items-center justify-center gap-1.5 px-2 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        // Default variant styles
        'group-data-[variant=default]/tabs-list:h-[calc(100%-2px)] group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:data-[state=active]:bg-background group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm py-1',
        // Line variant styles (No border on trigger itself, use pseudo-element)
        'group-data-[variant=line]/tabs-list:h-full group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:data-[state=active]:text-primary group-data-[variant=line]/tabs-list:pb-3 group-data-[variant=line]/tabs-list:pt-3',
        // The Indicator
        'after:absolute after:bg-primary after:opacity-0 after:transition-opacity',
        // Horizontal indicator
        'group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-0 group-data-[orientation=horizontal]/tabs:after:h-[2px]',
        // Vertical indicator
        'group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:right-0 group-data-[orientation=vertical]/tabs:after:w-[2px]',
        // Active state for indicator
        'data-[state=active]:after:opacity-100',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };

'use client';

import * as React from 'react';
import { PanelLeft, PanelLeftClose } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed: boolean;
  onToggle: () => void;
}

import { Brain } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Sidebar({ children, collapsed, onToggle, className, ...props }: SidebarProps) {
  return (
    <div
      className={`h-full flex flex-col border-r border-slate-800 bg-card overflow-hidden transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-72'
      } ${className || ''}`}
      {...props}
    >
      {/* Header with logo and theme toggle */}
      <div className="flex items-center h-16 px-4 border-b border-slate-800">
        <div className="flex items-center gap-2 flex-1">
          <Brain className={`h-6 w-6 text-brand-teal-500 ${collapsed ? 'mx-auto' : ''}`} />
          {!collapsed && (
            <span className="font-bold text-brand-teal-500">Synapse</span>
          )}
        </div>
        {!collapsed && <ThemeToggle />}
      </div>
      
      {children}
      
      <div className="p-2 border-t border-slate-800 mt-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4 text-brand-teal-500" />
          ) : (
            <PanelLeftClose className="h-4 w-4 text-brand-teal-500" />
          )}
        </Button>
      </div>
    </div>
  );
}
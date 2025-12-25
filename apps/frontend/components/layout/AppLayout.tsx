"use client";

import React, { useState } from "react";
import { Toolbar } from "./Toolbar";
import { Explorer } from "./Explorer";
import { Workspace } from "./Workspace";
import { AIConsole } from "./AIConsole";
import { Sidebar } from "@/components/ui/Sidebar";

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen w-screen grid grid-cols-[auto_1fr] grid-rows-[64px_1fr_200px] bg-background overflow-hidden">
      {/* Toolbar - spans full width */}
      <div className="col-span-2 border-b border-slate-800">
        <Toolbar />
      </div>

      {/* Explorer - left panel with collapsible sidebar */}
      <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
        <Explorer isCollapsed={isSidebarCollapsed} />
      </Sidebar>

      {/* Workspace - center area */}
      <div className="overflow-hidden">
        <Workspace />
      </div>

      {/* AI Console - bottom panel, spans full width */}
      <div className="col-span-2 border-t-2 border-slate-700 bg-background">
        <AIConsole />
      </div>
    </div>
  );
}


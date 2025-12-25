"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeView } from "@/components/explorer/TreeView";
import { useData } from "@/context/DataContext";

interface ExplorerProps {
  isCollapsed?: boolean;
}

export function Explorer({ isCollapsed = false }: ExplorerProps) {
  const { project, loading } = useData();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No project loaded</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <TreeView project={project} isCollapsed={isCollapsed} />
      </div>
    </ScrollArea>
  );
}


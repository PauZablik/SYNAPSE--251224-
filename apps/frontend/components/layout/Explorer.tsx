"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TreeView } from "@/components/explorer/TreeView";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/context/LocaleContext";

interface ExplorerProps {
  isCollapsed?: boolean;
}

export function Explorer({ isCollapsed = false }: ExplorerProps) {
  const { project, loading } = useData();
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">{t("Loading project...")}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">{t("No project loaded")}</p>
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


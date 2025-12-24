"use client";

import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
      <FolderOpen className="h-16 w-16 mb-4 opacity-50" />
      <p className="text-sm">
        {message || "Select a folder or document to begin"}
      </p>
    </div>
  );
}

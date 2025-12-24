"use client";

import React from "react";
import { Document } from "@/types";
import { DocumentCard } from "./DocumentCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileListViewProps {
  documents: Document[];
  folderId: string;
}

export function FileListView({ documents }: FileListViewProps) {
  if (documents.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          No documents in this folder
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

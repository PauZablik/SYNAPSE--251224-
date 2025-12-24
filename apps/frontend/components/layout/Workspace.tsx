"use client";

import React from "react";
import { useNavigation } from "@/context/NavigationContext";
import { useData } from "@/context/DataContext";
import { NodeType } from "@/types";
import { EmptyState } from "@/components/workspace/EmptyState";
import { FileListView } from "@/components/workspace/FileListView";
import { DocumentDetailView } from "@/components/workspace/DocumentDetailView";

export function Workspace() {
  const { selectedNodeId, selectedNodeType } = useNavigation();
  const { getFolderDocuments, getDocument } = useData();

  // Empty state - no selection
  if (!selectedNodeId || !selectedNodeType) {
    return <EmptyState />;
  }

  // Folder selected - show file list
  if (selectedNodeType === NodeType.FOLDER) {
    const documents = getFolderDocuments(selectedNodeId);
    return <FileListView documents={documents} folderId={selectedNodeId} />;
  }

  // Document selected - show document detail
  if (selectedNodeType === NodeType.DOCUMENT) {
    const document = getDocument(selectedNodeId);
    if (!document) {
      return <EmptyState message="Document not found" />;
    }
    return <DocumentDetailView document={document} />;
  }

  // Other node types (project, section) - show empty state
  return <EmptyState message="Select a folder or document to view its contents" />;
}


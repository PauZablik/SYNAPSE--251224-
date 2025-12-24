"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Project, Document, Folder } from "@/types";
import { createMockProject, getAllDocuments } from "@/data/mockData";

interface DataState {
  project: Project | null;
  documents: Map<string, Document>;
  loading: boolean;
  error: Error | null;
}

interface DataContextValue extends DataState {
  getFolder: (folderId: string) => Folder | undefined;
  getDocument: (documentId: string) => Document | undefined;
  getFolderDocuments: (folderId: string) => Document[];
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DataState>({
    project: null,
    documents: new Map(),
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const project = createMockProject();
        const documents = getAllDocuments(project);

        setState({
          project,
          documents,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
      }
    };

    loadData();
  }, []);

  const getFolder = (folderId: string): Folder | undefined => {
    if (!state.project) return undefined;

    for (const section of state.project.sections) {
      const folder = section.folders.find((f) => f.id === folderId);
      if (folder) return folder;
    }
    return undefined;
  };

  const getDocument = (documentId: string): Document | undefined => {
    return state.documents.get(documentId);
  };

  const getFolderDocuments = (folderId: string): Document[] => {
    const folder = getFolder(folderId);
    return folder?.documents || [];
  };

  const value: DataContextValue = {
    ...state,
    getFolder,
    getDocument,
    getFolderDocuments,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

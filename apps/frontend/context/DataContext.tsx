"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Project, Document, Folder, Section, DocumentType, DocumentStatus } from "@/types";
import { supabase } from "@/lib/api/supabaseClient";

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
  createProject: (projectName: string) => Promise<void>;
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
    // Load data from Supabase
    const loadData = async () => {
      try {
        // Get the user's projects
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;

        if (projects && projects.length > 0) {
          // Get the first project for now (in a real app, we might want to select a specific one)
          const project = projects[0];

          // Get sections for this project
          const { data: sectionsData, error: sectionsError } = await supabase
            .from('sections')
            .select('*')
            .eq('project_id', project.id);

          if (sectionsError) throw sectionsError;

          // Create a mapping of sections to use in building the project structure
          const sectionsMap = new Map<string, any>();
          sectionsData.forEach((section: any) => {
            const sectionObj = {
              id: section.id,
              name: section.name,
              code: section.code,
              projectId: section.project_id,
              documents: [] as Document[], // Will populate below
            };
            sectionsMap.set(section.id, sectionObj);
          });

          // Get documents for these sections
          const { data: documentsData, error: documentsError } = await supabase
            .from('documents')
            .select('*')
            .in('section_id', sectionsData.map(s => s.id));

          if (documentsError) throw documentsError;

          // Group documents by section
          documentsData?.forEach((doc: any) => {
            const section = sectionsMap.get(doc.section_id);
            if (section) {
              // Convert Supabase document to our Document type
              const document: Document = {
                id: doc.id,
                name: doc.name,
                type: doc.type as DocumentType, // Assuming the type matches our enum
                uploadDate: doc.created_at,
                status: doc.status as DocumentStatus, // Assuming the type matches our enum
                folderId: `folder-${doc.section_id}`, // Use section_id as folderId
              };
              (section as any).documents.push(document);
            }
          });

          // Convert sections map to array
          const sections = Array.from(sectionsMap.values());

          // Create the project object
          const projectWithSections = {
            id: project.id,
            name: project.name,
            sections,
          };

          // Create documents map
          const documentsMap = new Map<string, Document>();
          sections.forEach((section: any) => {
            section.documents.forEach((doc: Document) => {
              documentsMap.set(doc.id, doc);
            });
          });

          setState({
            project: projectWithSections,
            documents: documentsMap,
            loading: false,
            error: null,
          });
        } else {
          // No projects yet
          setState({
            project: null,
            documents: new Map(),
            loading: false,
            error: null,
          });
        }
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

  const createProject = async (projectName: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ name: projectName }])
        .select()
        .single();

      if (error) throw error;

      // Reload the data to include the new project
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      // Get the user's projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      if (projects && projects.length > 0) {
        // Get the first project (most recently created)
        const project = projects[0];

        // Get sections for this project
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .eq('project_id', project.id);

        if (sectionsError) throw sectionsError;

        // Create a mapping of sections to use in building the project structure
        const sectionsMap = new Map<string, any>();
        sectionsData.forEach((section: any) => {
          const sectionObj = {
            id: section.id,
            name: section.name,
            code: section.code,
            projectId: section.project_id,
            documents: [] as Document[], // Will populate below
          };
          sectionsMap.set(section.id, sectionObj);
        });

        // Get documents for these sections
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .in('section_id', sectionsData.map((s: any) => s.id));

        if (documentsError) throw documentsError;

        // Group documents by section
        documentsData?.forEach((doc: any) => {
          const section = sectionsMap.get(doc.section_id);
          if (section) {
            // Convert Supabase document to our Document type
            const document: Document = {
              id: doc.id,
              name: doc.name,
              type: doc.type as DocumentType, // Assuming the type matches our enum
              uploadDate: doc.created_at,
              status: doc.status as DocumentStatus, // Assuming the type matches our enum
              folderId: `folder-${doc.section_id}`, // Use section_id as folderId
            };
            (section as any).documents.push(document);
          }
        });

        // Convert sections map to array
        const sections = Array.from(sectionsMap.values());

        // Create the project object
        const projectWithSections = {
          id: project.id,
          name: project.name,
          sections,
        };

        // Create documents map
        const documentsMap = new Map<string, Document>();
        sections.forEach((section: any) => {
          section.documents.forEach((doc: Document) => {
            documentsMap.set(doc.id, doc);
          });
        });

        setState({
          project: projectWithSections,
          documents: documentsMap,
          loading: false,
          error: null,
        });
      } else {
        // No projects yet
        setState({
          project: null,
          documents: new Map(),
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
      throw error;
    }
  };

  const value: DataContextValue = {
    ...state,
    getFolder,
    getDocument,
    getFolderDocuments,
    createProject,
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

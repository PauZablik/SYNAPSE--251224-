"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, ScanLine, FileOutput, Plus } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/context/LocaleContext";

export function Toolbar() {
  const { createProject } = useData();
  const { t } = useLocale();

  const handleCreateProject = async () => {
    try {
      const projectName = prompt(t("Enter project name:"));
      if (projectName) {
        await createProject(projectName);
      }
    } catch (error: any) {
      console.error(t("Error creating project:"), error);
      
      // Check if it's a Supabase configuration error
      if (error && typeof error === 'object' && error.message === 'Supabase not configured') {
        alert('Supabase is not configured. Please set up your Supabase environment variables in .env.local file.');
      } else {
        const errorMessage = error?.message || JSON.stringify(error) || t("Failed to create project. Please try again.");
        alert(`${t("Failed to create project. Please try again.")} (${errorMessage})`);
      }
    }
  };

  return (
    <div className="h-16 px-4 flex items-center gap-3 bg-card">
      <Button
        onClick={handleCreateProject}
        variant="default"
        className="gap-2 bg-brand-teal-500 hover:bg-brand-teal-600 text-white"
        title={t("Create new project")}
      >
        <Plus className="h-4 w-4" />
        {t("New Project")}
      </Button>

      <Button
        disabled
        variant="default"
        className="gap-2 bg-brand-teal-500 hover:bg-brand-teal-600 text-white"
        title={t("Upload documents")}
      >
        <Upload className="h-4 w-4" />
        {t("Upload")}
      </Button>

      <Button
        disabled
        variant="default"
        className="gap-2 bg-brand-teal-500 hover:bg-brand-teal-600 text-white"
        title={t("Analyze documents with AI")}
      >
        <ScanLine className="h-4 w-4" />
        {t("Analyze")}
      </Button>

      <Button
        disabled
        variant="default"
        className="gap-2 bg-brand-teal-500 hover:bg-brand-teal-600 text-white"
        title={t("Generate reports from templates")}
      >
        <FileOutput className="h-4 w-4" />
        {t("Generate")}
      </Button>
    </div>
  );
}


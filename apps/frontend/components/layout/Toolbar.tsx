"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, ScanLine, FileOutput } from "lucide-react";

export function Toolbar() {
  return (
    <div className="h-16 px-4 flex items-center gap-3 bg-card">
      <Button
        disabled
        variant="default"
        className="gap-2"
        title="Upload documents"
      >
        <Upload className="h-4 w-4" />
        Upload
      </Button>

      <Button
        disabled
        variant="default"
        className="gap-2"
        title="Analyze documents with AI"
      >
        <ScanLine className="h-4 w-4" />
        Analyze
      </Button>

      <Button
        disabled
        variant="default"
        className="gap-2"
        title="Generate reports from templates"
      >
        <FileOutput className="h-4 w-4" />
        Generate
      </Button>
    </div>
  );
}


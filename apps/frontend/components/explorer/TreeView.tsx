"use client";

import React from "react";
import { Project, NodeType, Document } from "@/types";
import { TreeNode } from "./TreeNode";
import { FolderKanban } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

interface TreeViewProps {
  project: Project;
  isCollapsed?: boolean;
}

export function TreeView({ project, isCollapsed = false }: TreeViewProps) {
  return (
    <div className="space-y-1">
      {/* Project root */}
      <TreeNode
        id={project.id}
        label={project.name}
        type={NodeType.PROJECT}
        icon={<FolderKanban className="h-4 w-4" />}
        level={0}
        isCollapsed={isCollapsed}
      >
        {/* Sections */}
        {project.sections.map((section) => (
          <TreeNode
            key={section.id}
            id={section.id}
            label={section.name}
            type={NodeType.SECTION}
            level={1}
            isCollapsed={isCollapsed}
          >
              {/* Virtual Folders - Create a folder for each section to maintain UI structure */}
            {(() => {
              // Create a virtual folder containing all documents in this section
              const virtualFolderId = `folder-${section.id}`;
              const { t } = useLocale(); // Use locale for translation
              const virtualFolderName = t("Documents"); // Default name for the virtual folder
              
              // Filter documents that belong to this section
              const sectionDocuments = section.documents || [];
              
              return (
                <TreeNode
                  key={virtualFolderId}
                  id={virtualFolderId}
                  label={virtualFolderName}
                  type={NodeType.FOLDER}
                  level={2}
                  documentCount={sectionDocuments.length}
                  isCollapsed={isCollapsed}
                >
                  {/* Documents */}
                  {sectionDocuments.map((document: Document) => (
                    <TreeNode
                      key={document.id}
                      id={document.id}
                      label={document.name}
                      type={NodeType.DOCUMENT}
                      level={3}
                      status={document.status}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </TreeNode>
              );
            })()}
          </TreeNode>
        ))}
      </TreeNode>
    </div>
  );
}

"use client";

import React from "react";
import { Project, NodeType } from "@/types";
import { TreeNode } from "./TreeNode";
import { FolderKanban } from "lucide-react";

interface TreeViewProps {
  project: Project;
}

export function TreeView({ project }: TreeViewProps) {
  return (
    <div className="space-y-1">
      {/* Project root */}
      <TreeNode
        id={project.id}
        label={project.name}
        type={NodeType.PROJECT}
        icon={<FolderKanban className="h-4 w-4" />}
        level={0}
      >
        {/* Sections */}
        {project.sections.map((section) => (
          <TreeNode
            key={section.id}
            id={section.id}
            label={section.name}
            type={NodeType.SECTION}
            level={1}
          >
            {/* Folders */}
            {section.folders.map((folder) => (
              <TreeNode
                key={folder.id}
                id={folder.id}
                label={folder.name}
                type={NodeType.FOLDER}
                level={2}
                documentCount={folder.documents.length}
              >
                {/* Documents */}
                {folder.documents.map((document) => (
                  <TreeNode
                    key={document.id}
                    id={document.id}
                    label={document.name}
                    type={NodeType.DOCUMENT}
                    level={3}
                    status={document.status}
                  />
                ))}
              </TreeNode>
            ))}
          </TreeNode>
        ))}
      </TreeNode>
    </div>
  );
}

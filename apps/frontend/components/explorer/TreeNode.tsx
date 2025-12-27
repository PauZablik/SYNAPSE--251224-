"use client";

import React from "react";
import { ChevronRight, Folder, FileText, Package } from "lucide-react";
import { useNavigation } from "@/context/NavigationContext";
import { NodeType, DocumentStatus } from "@/types";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/context/LocaleContext";

interface TreeNodeProps {
  id: string;
  label: string;
  type: NodeType;
  level: number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  documentCount?: number;
  status?: DocumentStatus;
  isCollapsed?: boolean;
}

export function TreeNode({
  id,
  label,
  type,
  level,
  icon,
  children,
  documentCount,
  status,
  isCollapsed = false,
}: TreeNodeProps) {
  const {
    selectedNodeId,
    selectNode,
    toggleNodeExpansion,
    isNodeExpanded,
  } = useNavigation();
  
  const { t } = useLocale();

  const isSelected = selectedNodeId === id;
  const isExpanded = isNodeExpanded(id);
  const hasChildren = React.Children.count(children) > 0;
  const indentPx = level * 16;

  const handleClick = () => {
    selectNode(id, type);
    if (hasChildren && type !== NodeType.DOCUMENT) {
      toggleNodeExpansion(id);
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNodeExpansion(id);
  };

  // Choose icon based on node type
  const renderIcon = () => {
    if (icon) return icon;

    switch (type) {
      case NodeType.SECTION:
        return <Package className="h-4 w-4" />;
      case NodeType.FOLDER:
        return <Folder className="h-4 w-4" />;
      case NodeType.DOCUMENT:
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Status badge for documents
  const renderStatusBadge = () => {
    if (type !== NodeType.DOCUMENT || !status) return null;

    const statusColors = {
      [DocumentStatus.COMPLETED]: "bg-green-500/20 text-green-400",
      [DocumentStatus.PROCESSING]: "bg-amber-500/20 text-amber-400",
      [DocumentStatus.UPLOADED]: "bg-blue-500/20 text-blue-400",
      [DocumentStatus.ERROR]: "bg-red-500/20 text-red-400",
    };

    return (
      <span
        className={cn(
          "text-xs px-1.5 py-0.5 rounded",
          statusColors[status]
        )}
      >
        {status === DocumentStatus.COMPLETED && t("✓")}
        {status === DocumentStatus.PROCESSING && t("...")}
        {status === DocumentStatus.UPLOADED && t("○")}
        {status === DocumentStatus.ERROR && t("✗")}
      </span>
    );
  };

  return (
    <div>
      {/* Node row */}
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors group relative",
          "hover:bg-slate-800",
          isSelected && "bg-slate-800"
        )}
        style={{ paddingLeft: `${indentPx + 8}px` }}
        onClick={handleClick}
      >
        {/* Accent border for selected item */}
        {isSelected && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
        )}

        {/* Chevron for expandable nodes */}
        {hasChildren && type !== NodeType.DOCUMENT ? (
          <button
            className="shrink-0 hover:bg-slate-700 rounded p-0.5 transition-transform"
            onClick={handleChevronClick}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Icon */}
        <div className="shrink-0 text-muted-foreground">{renderIcon()}</div>

        {/* Label - only show if not collapsed */}
        {!isCollapsed && (
          <>
            <span
              className={cn(
                "text-sm flex-1 truncate",
                isSelected ? "text-foreground font-medium" : "text-foreground"
              )}
            >
              {label}
            </span>

            {/* Document count badge for folders */}
            {type === NodeType.FOLDER && documentCount !== undefined && (
              <span className="text-xs text-muted-foreground font-mono">
                {documentCount}
              </span>
            )}

            {/* Status badge for documents */}
            {renderStatusBadge()}
          </>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && !isCollapsed && <div className="mt-0.5">{children}</div>}
    </div>
  );
}


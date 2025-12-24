"use client";

import React from "react";
import { Document, DocumentStatus, DocumentType } from "@/types";
import { Card } from "@/components/ui/card";
import { FileText, FileSpreadsheet, FileImage } from "lucide-react";
import { useNavigation } from "@/context/NavigationContext";
import { NodeType } from "@/types";
import { cn } from "@/lib/utils/cn";

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { selectedNodeId, selectNode } = useNavigation();
  const isSelected = selectedNodeId === document.id;

  const handleClick = () => {
    selectNode(document.id, NodeType.DOCUMENT);
  };

  // Get file type icon
  const getFileIcon = () => {
    const extension = document.name.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "xlsx":
      case "xls":
        return <FileSpreadsheet className="h-5 w-5" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <FileImage className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    const statusStyles = {
      [DocumentStatus.ANALYZED]: "bg-green-500/20 text-green-400 border-green-500/30",
      [DocumentStatus.PENDING]: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      [DocumentStatus.DRAFT]: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };

    const statusLabels = {
      [DocumentStatus.ANALYZED]: "Analyzed",
      [DocumentStatus.PENDING]: "Pending",
      [DocumentStatus.DRAFT]: "Draft",
    };

    return (
      <span
        className={cn(
          "text-xs px-2 py-1 rounded border",
          statusStyles[document.status]
        )}
      >
        {statusLabels[document.status]}
      </span>
    );
  };

  // Format date
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:border-slate-700",
        isSelected && "border-primary"
      )}
      onClick={handleClick}
    >
      {/* Header with icon and name */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-muted-foreground shrink-0">{getFileIcon()}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate">{document.name}</h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {formatDate(document.uploadDate)}
          </p>
        </div>
      </div>

      {/* Metadata preview */}
      {document.metadata && (
        <div className="space-y-1 mb-3">
          <p className="text-xs text-muted-foreground truncate">
            <span className="font-medium">Customer:</span>{" "}
            {document.metadata.customer}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            <span className="font-medium">Object:</span>{" "}
            {document.metadata.projectObject}
          </p>
        </div>
      )}

      {/* Footer with status */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        {getStatusBadge()}
        {document.type === DocumentType.TEMPLATE && (
          <span className="text-xs text-muted-foreground">Template</span>
        )}
      </div>
    </Card>
  );
}

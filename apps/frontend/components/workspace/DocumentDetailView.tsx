"use client";

import React from "react";
import { Document, DocumentStatus } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Building2, MapPin, Ruler, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DocumentDetailViewProps {
  document: Document;
}

export function DocumentDetailView({ document }: DocumentDetailViewProps) {
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = () => {
    const statusStyles = {
      [DocumentStatus.ANALYZED]: "bg-green-500/20 text-green-400 border-green-500/30",
      [DocumentStatus.PENDING]: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      [DocumentStatus.DRAFT]: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };

    const statusLabels = {
      [DocumentStatus.ANALYZED]: "Analyzed",
      [DocumentStatus.PENDING]: "Pending Analysis",
      [DocumentStatus.DRAFT]: "Draft",
    };

    return (
      <span
        className={cn(
          "text-sm px-3 py-1.5 rounded border font-medium",
          statusStyles[document.status]
        )}
      >
        {statusLabels[document.status]}
      </span>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl">
        {/* Document header */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{document.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(document.uploadDate)}
                </span>
                {getStatusBadge()}
              </div>
            </div>
          </div>
          <Separator />
        </div>

        {/* Metadata section */}
        {document.metadata ? (
          <div className="space-y-6">
            {/* Project Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  <p className="text-sm">{document.metadata.customer}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Object</p>
                  <p className="text-sm">{document.metadata.projectObject}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Address</p>
                    <p className="text-sm">{document.metadata.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-primary" />
                  Technical Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Axes */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Grid Axes</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium mb-1">Horizontal</p>
                      <p className="text-sm font-mono">
                        {document.metadata.axes
                          .filter((a) => a.direction === "horizontal")
                          .map((a) => a.label)
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Vertical</p>
                      <p className="text-sm font-mono">
                        {document.metadata.axes
                          .filter((a) => a.direction === "vertical")
                          .map((a) => a.label)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Elevation Marks */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Elevation Marks
                  </p>
                  <p className="text-sm font-mono">
                    {document.metadata.elevationMarks
                      .map((m) => (m >= 0 ? `+${m.toFixed(3)}` : m.toFixed(3)))
                      .join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bill of Materials */}
            {document.metadata.billOfMaterials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Bill of Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">
                            #
                          </th>
                          <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">
                            Name
                          </th>
                          <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                            Weight (kg)
                          </th>
                          <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                            Qty
                          </th>
                          <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                            Total (kg)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {document.metadata.billOfMaterials.map((item) => (
                          <tr
                            key={item.position}
                            className="border-b border-slate-800/50 hover:bg-slate-800/30"
                          >
                            <td className="py-2 px-3 font-mono text-muted-foreground">
                              {item.position}
                            </td>
                            <td className="py-2 px-3">{item.name}</td>
                            <td className="py-2 px-3 text-right font-mono">
                              {item.weight.toFixed(1)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono">
                              {item.quantity}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-medium">
                              {item.totalWeight.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-700">
                          <td colSpan={4} className="py-2 px-3 text-right font-medium">
                            Total Weight:
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-primary">
                            {document.metadata.billOfMaterials
                              .reduce((sum, item) => sum + item.totalWeight, 0)
                              .toFixed(1)}{" "}
                            kg
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No metadata available for this document.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}

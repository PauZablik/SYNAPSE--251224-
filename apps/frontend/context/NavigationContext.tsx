"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { NodeType } from "@/types";

interface NavigationState {
  selectedNodeId: string | null;
  selectedNodeType: NodeType | null;
  expandedNodeIds: Set<string>;
}

interface NavigationContextValue extends NavigationState {
  selectNode: (nodeId: string, nodeType: NodeType) => void;
  clearSelection: () => void;
  toggleNodeExpansion: (nodeId: string) => void;
  isNodeExpanded: (nodeId: string) => boolean;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined
);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<NavigationState>({
    selectedNodeId: null,
    selectedNodeType: null,
    expandedNodeIds: new Set(["project-1", "section-km"]), // Initially expand project and first section
  });

  const selectNode = useCallback((nodeId: string, nodeType: NodeType) => {
    setState((prev) => ({
      ...prev,
      selectedNodeId: nodeId,
      selectedNodeType: nodeType,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedNodeId: null,
      selectedNodeType: null,
    }));
  }, []);

  const toggleNodeExpansion = useCallback((nodeId: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedNodeIds);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return {
        ...prev,
        expandedNodeIds: newExpanded,
      };
    });
  }, []);

  const isNodeExpanded = useCallback(
    (nodeId: string) => {
      return state.expandedNodeIds.has(nodeId);
    },
    [state.expandedNodeIds]
  );

  const value: NavigationContextValue = {
    ...state,
    selectNode,
    clearSelection,
    toggleNodeExpansion,
    isNodeExpanded,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

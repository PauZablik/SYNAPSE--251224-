// Re-export all types from packages/types for frontend convenience
// In a full monorepo setup with pnpm, these would be imported from @synapse/types
// For now, we duplicate the essential types here

export enum DocumentType {
  PROJECT = "project",
  TEMPLATE = "template",
  REPORT = "report",
}

export enum DocumentStatus {
  ANALYZED = "analyzed",
  PENDING = "pending",
  DRAFT = "draft",
}

export enum SectionType {
  KM = "КМ",
  KZH = "КЖ",
}

export enum AxisDirection {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export enum NodeType {
  PROJECT = "project",
  SECTION = "section",
  FOLDER = "folder",
  DOCUMENT = "document",
}

export interface AxisData {
  direction: AxisDirection;
  label: string;
  position: number;
}

export interface BOMEntry {
  position: string;
  name: string;
  weight: number;
  quantity: number;
  totalWeight: number;
}

export interface DocumentMetadata {
  customer: string;
  projectObject: string;
  address: string;
  axes: AxisData[];
  elevationMarks: number[];
  billOfMaterials: BOMEntry[];
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  status: DocumentStatus;
  metadata?: DocumentMetadata;
  folderId: string;
}

export interface Folder {
  id: string;
  name: string;
  sectionId: string;
  documents: Document[];
}

export interface Section {
  id: string;
  name: string;
  type: SectionType;
  projectId: string;
  folders: Folder[];
}

export interface Project {
  id: string;
  name: string;
  sections: Section[];
}

export interface TreeNode {
  id: string;
  label: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
}

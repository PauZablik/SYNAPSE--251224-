// Enums
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
  KM = "КМ", // Metal Structures
  KZH = "КЖ", // Reinforced Concrete
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

// Axis Data Structure
export interface AxisData {
  direction: AxisDirection;
  label: string;
  position: number; // Coordinate in mm
}

// Bill of Materials Entry
export interface BOMEntry {
  position: string; // Item number in list
  name: string; // Component designation
  weight: number; // Unit weight in kg
  quantity: number; // Count
  totalWeight: number; // Calculated total
}

// Document Metadata Structure
export interface DocumentMetadata {
  customer: string; // Client organization
  projectObject: string; // Construction object name
  address: string; // Physical location
  axes: AxisData[]; // Grid lines and marks
  elevationMarks: number[]; // Height references
  billOfMaterials: BOMEntry[]; // Materials list
}

// Document Entity
export interface Document {
  id: string; // Unique identifier
  name: string; // Display name
  type: DocumentType; // Document category
  uploadDate: string; // ISO datetime
  status: DocumentStatus; // Processing state
  metadata?: DocumentMetadata; // Extracted information (optional for templates/drafts)
  folderId: string; // Parent folder
}

// Folder Entity
export interface Folder {
  id: string;
  name: string;
  sectionId: string; // Parent section
  documents: Document[];
}

// Section Entity
export interface Section {
  id: string;
  name: string;
  type: SectionType;
  projectId: string; // Parent project
  folders: Folder[];
}

// Project Entity
export interface Project {
  id: string;
  name: string;
  sections: Section[];
}

// Tree Node (for navigation)
export interface TreeNode {
  id: string;
  label: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
}
// Enums
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
  KM = "КМ", // Metal Structures
  KZH = "КЖ", // Reinforced Concrete
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

// Axis Data Structure
export interface AxisData {
  direction: AxisDirection;
  label: string;
  position: number; // Coordinate in mm
}

// Bill of Materials Entry
export interface BOMEntry {
  position: string; // Item number in list
  name: string; // Component designation
  weight: number; // Unit weight in kg
  quantity: number; // Count
  totalWeight: number; // Calculated total
}

// Document Metadata Structure
export interface DocumentMetadata {
  customer: string; // Client organization
  projectObject: string; // Construction object name
  address: string; // Physical location
  axes: AxisData[]; // Grid lines and marks
  elevationMarks: number[]; // Height references
  billOfMaterials: BOMEntry[]; // Materials list
}

// Document Entity
export interface Document {
  id: string; // Unique identifier
  name: string; // Display name
  type: DocumentType; // Document category
  uploadDate: string; // ISO datetime
  status: DocumentStatus; // Processing state
  metadata?: DocumentMetadata; // Extracted information (optional for templates/drafts)
  folderId: string; // Parent folder
}

// Folder Entity
export interface Folder {
  id: string;
  name: string;
  sectionId: string; // Parent section
  documents: Document[];
}

// Section Entity
export interface Section {
  id: string;
  name: string;
  type: SectionType;
  projectId: string; // Parent project
  folders: Folder[];
}

// Project Entity
export interface Project {
  id: string;
  name: string;
  sections: Section[];
}

// Tree Node (for navigation)
export interface TreeNode {
  id: string;
  label: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
}

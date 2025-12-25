// ============================================================================
// ENUMS
// ============================================================================

// Document Type Classification
export enum DocumentType {
  PROJECT = "project",      // Not used in new schema
  TEMPLATE = "template",    // Not used in new schema
  REPORT = "report",        // Not used in new schema
  DESIGN = "design",        // Design documentation (input)
  EXECUTIVE = "executive",  // Executive documentation (output)
}

// Document Processing Status
// Aligned with database schema: uploaded, processing, completed, error
export enum DocumentStatus {
  UPLOADED = "uploaded",       // File received but not processed
  PROCESSING = "processing",   // AI analysis in progress
  COMPLETED = "completed",     // Analysis finished successfully
  ERROR = "error",             // Processing failed
}

// Section Type Classification
export enum SectionType {
  KM = "КМ",   // Metal Structures
  KZH = "КЖ",  // Reinforced Concrete
}

// Axis Direction for Grid Lines
export enum AxisDirection {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

// Navigation Tree Node Types
export enum NodeType {
  PROJECT = "project",
  SECTION = "section",
  FOLDER = "folder",
  DOCUMENT = "document",
}

// ============================================================================
// DATA STRUCTURES
// ============================================================================

// Axis Data Structure for Engineering Grids
export interface AxisData {
  direction: AxisDirection;
  label: string;      // Axis identifier (e.g., "А", "Б", "1", "2")
  position: number;   // Coordinate in millimeters
}

// Bill of Materials Entry
export interface BOMEntry {
  position: string;     // Item number in list
  name: string;         // Component designation
  weight: number;       // Unit weight in kg
  quantity: number;     // Count
  totalWeight: number;  // Calculated total weight
}

// Document Metadata Structure (AI Extracted Data)
export interface DocumentMetadata {
  customer: string;              // Client organization
  projectObject: string;         // Construction object name
  address: string;               // Physical location
  axes: AxisData[];              // Grid lines and marks
  elevationMarks: number[];      // Height references
  billOfMaterials: BOMEntry[];   // Materials list
}

// ============================================================================
// DOMAIN ENTITIES
// ============================================================================

// Document Entity
export interface Document {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // File name with extension
  type: DocumentType;            // Document category
  uploadDate: string;            // ISO datetime
  status: DocumentStatus;        // Processing state
  metadata?: DocumentMetadata;   // Extracted information (optional)
  sectionId: string;             // Parent section (updated from folderId)
  storagePath?: string;          // Supabase Storage path
}

// Section Entity
export interface Section {
  id: string;           // Unique identifier (UUID)
  name: string;         // Section display name
  code: string;         // Section code (e.g., "КМ", "КЖ")
  projectId: string;    // Parent project
  documents?: Document[]; // Documents in this section (optional for lazy loading)
}

// Project Entity
export interface Project {
  id: string;           // Unique identifier (UUID)
  name: string;         // Project display name
  address?: string;     // Construction site address
  client?: string;      // Client organization name
  sections?: Section[]; // Sections in this project (optional for lazy loading)
  createdAt?: string;   // ISO datetime
  updatedAt?: string;   // ISO datetime
}

// Extracted Data Entity (from database)
export interface ExtractedData {
  id: string;              // Unique identifier (UUID)
  documentId: string;      // Parent document reference
  data: DocumentMetadata;  // JSONB extracted metadata
  confidenceScore?: number; // AI model confidence (0.0 to 1.0)
  createdAt?: string;      // ISO datetime
  updatedAt?: string;      // ISO datetime
}

// ============================================================================
// NAVIGATION STRUCTURES
// ============================================================================

// Tree Node for Navigation Panel
export interface TreeNode {
  id: string;
  label: string;
  type: NodeType;
  children?: TreeNode[];
  parentId?: string;
}

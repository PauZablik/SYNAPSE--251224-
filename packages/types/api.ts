import { Document, DocumentMetadata } from "./document";

// Upload Document Request
export interface UploadDocumentRequest {
  file: File; // Binary file data
  projectId: string; // Target project identifier
  sectionId: string; // Target section identifier
  folderId: string; // Target folder identifier
}

// Upload Document Response
export interface UploadDocumentResponse {
  documentId: string; // Generated identifier
  status: string; // Initial processing status
  uploadedAt: string; // Timestamp
}

// Analyze Document Request
export interface AnalyzeDocumentRequest {
  documentId: string; // Document to analyze
}

// Analyze Document Response
export interface AnalyzeDocumentResponse {
  documentId: string; // Reference identifier
  metadata: DocumentMetadata; // Extracted metadata object
  confidence: number; // Analysis confidence score (0-1)
  analyzedAt: string; // Timestamp
}

// Generate Document Request
export interface GenerateDocumentRequest {
  templateId: string; // Template document to use
  documentMetadata: DocumentMetadata; // Data to inject
}

// Generate Document Response
export interface GenerateDocumentResponse {
  documentId: string; // Generated document identifier
  downloadUrl: string; // URL to download the file
  generatedAt: string; // Timestamp
}

// Get Documents Request
export interface GetDocumentsRequest {
  folderId: string; // Folder to fetch documents from
}

// Get Documents Response
export interface GetDocumentsResponse {
  documents: Document[];
}

// API Error Response
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
import { Document, DocumentMetadata } from "./document";

// Upload Document Request
export interface UploadDocumentRequest {
  file: File; // Binary file data
  projectId: string; // Target project identifier
  sectionId: string; // Target section identifier
  folderId: string; // Target folder identifier
}

// Upload Document Response
export interface UploadDocumentResponse {
  documentId: string; // Generated identifier
  status: string; // Initial processing status
  uploadedAt: string; // Timestamp
}

// Analyze Document Request
export interface AnalyzeDocumentRequest {
  documentId: string; // Document to analyze
}

// Analyze Document Response
export interface AnalyzeDocumentResponse {
  documentId: string; // Reference identifier
  metadata: DocumentMetadata; // Extracted metadata object
  confidence: number; // Analysis confidence score (0-1)
  analyzedAt: string; // Timestamp
}

// Generate Document Request
export interface GenerateDocumentRequest {
  templateId: string; // Template document to use
  documentMetadata: DocumentMetadata; // Data to inject
}

// Generate Document Response
export interface GenerateDocumentResponse {
  documentId: string; // Generated document identifier
  downloadUrl: string; // URL to download the file
  generatedAt: string; // Timestamp
}

// Get Documents Request
export interface GetDocumentsRequest {
  folderId: string; // Folder to fetch documents from
}

// Get Documents Response
export interface GetDocumentsResponse {
  documents: Document[];
}

// API Error Response
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

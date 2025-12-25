# Database Infrastructure Setup - SYNAPSE Platform

## Overview

This design establishes the database and storage infrastructure for SYNAPSE using Supabase as the backend-as-a-service platform. Building upon the frontend architecture (see frontend-architecture-setup.md), this phase implements the "Central Nervous System" that will power document management, AI processing workflows, and multi-tenant data security.

## Strategic Context

**Foundation Built**: Frontend UI with 4-zone IDE-style layout, hierarchical navigation, and TypeScript type system.

**Current Goal**: Transform the frontend from mock data consumption to real database integration with secure multi-tenant architecture.

**Design Philosophy**: Database-first approach where PostgreSQL schema serves as the single source of truth, with Row Level Security (RLS) enforcing tenant isolation at the database layer rather than application logic.

## Database Architecture Strategy

### Multi-Tenant Isolation Model

**Approach**: User-scoped data access through Supabase Auth integration

**Security Layer**: Row Level Security (RLS) policies enforce data boundaries at the PostgreSQL level

**Rationale**: By implementing security constraints directly in the database, we eliminate entire classes of authorization bugs and ensure that even compromised application code cannot leak cross-tenant data.

### Schema Design Principles

| Principle | Implementation | Benefit |
|-----------|----------------|---------|
| Normalized Structure | Separate tables for projects, sections, folders, documents, metadata | Eliminates data duplication, enables efficient queries |
| JSONB for Semi-Structured Data | Store extracted AI data (axes, BOM, elevation marks) in flexible schema | Accommodates varying document formats without schema migrations |
| Cascading Deletes | ON DELETE CASCADE for parent-child relationships | Automatic cleanup prevents orphaned records |
| Audit Timestamps | created_at and updated_at on all tables | Track data lifecycle for debugging and compliance |
| Type Safety Alignment | Database enums match TypeScript enums in packages/types | Ensures backend-frontend contract consistency |

## Data Model

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ SECTIONS : contains
    SECTIONS ||--o{ DOCUMENTS : organizes
    DOCUMENTS ||--o| EXTRACTED_DATA : has
    DOCUMENTS }o--|| STORAGE_FILES : references

    USERS {
        uuid id PK
        string email
        timestamp created_at
    }
    
    PROJECTS {
        uuid id PK
        uuid user_id FK
        string name
        string address
        string client
        timestamp created_at
        timestamp updated_at
    }
    
    SECTIONS {
        uuid id PK
        uuid project_id FK
        string name
        string code
        timestamp created_at
        timestamp updated_at
    }
    
    DOCUMENTS {
        uuid id PK
        uuid section_id FK
        string name
        string storage_path
        enum status
        enum type
        timestamp created_at
        timestamp updated_at
    }
    
    EXTRACTED_DATA {
        uuid id PK
        uuid document_id FK
        jsonb data
        float confidence_score
        timestamp created_at
        timestamp updated_at
    }
```

### Table Specifications

#### 1. Projects Table

**Purpose**: Top-level entity representing construction projects owned by authenticated users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique project identifier |
| user_id | uuid | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | Owner reference from Supabase Auth |
| name | text | NOT NULL | Project display name |
| address | text | NULL | Construction site address |
| client | text | NULL | Client organization name |
| created_at | timestamp with time zone | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp with time zone | DEFAULT NOW() | Last modification timestamp |

**Indexes**:
- PRIMARY KEY on id (automatic)
- INDEX on user_id for efficient user-scoped queries

**RLS Policy**: Users can SELECT, INSERT, UPDATE, DELETE only rows where user_id = auth.uid()

#### 2. Sections Table

**Purpose**: Organizational divisions within projects (e.g., КМ - Metal Structures, КЖ - Reinforced Concrete)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique section identifier |
| project_id | uuid | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Parent project |
| name | text | NOT NULL | Section display name |
| code | text | NOT NULL | Section code identifier (e.g., "КМ", "КЖ") |
| created_at | timestamp with time zone | DEFAULT NOW() | Record creation timestamp |
| updated_at | timestamp with time zone | DEFAULT NOW() | Last modification timestamp |

**Indexes**:
- PRIMARY KEY on id (automatic)
- INDEX on project_id for efficient parent lookups
- INDEX on code for filtering by section type

**RLS Policy**: Users can access sections belonging to projects they own (join through projects table)

#### 3. Documents Table

**Purpose**: Uploaded files and generated reports within project sections

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique document identifier |
| section_id | uuid | NOT NULL, REFERENCES sections(id) ON DELETE CASCADE | Parent section |
| name | text | NOT NULL | File name with extension |
| storage_path | text | NULL | Supabase Storage path reference (null for drafts) |
| status | text | NOT NULL, DEFAULT 'uploaded' | Processing state enum |
| type | text | NOT NULL | Document category enum |
| created_at | timestamp with time zone | DEFAULT NOW() | Upload timestamp |
| updated_at | timestamp with time zone | DEFAULT NOW() | Last modification timestamp |

**Status Enum Values**:
- `uploaded`: File received but not processed
- `processing`: AI analysis in progress
- `completed`: Analysis finished successfully
- `error`: Processing failed

**Type Enum Values**:
- `design`: Project design documentation (input)
- `executive`: Generated executive documentation (output)

**Indexes**:
- PRIMARY KEY on id (automatic)
- INDEX on section_id for efficient parent lookups
- INDEX on status for filtering by processing state

**RLS Policy**: Users can access documents in sections belonging to their projects

#### 4. Extracted Data Table

**Purpose**: AI-extracted engineering information from analyzed documents

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique record identifier |
| document_id | uuid | NOT NULL, REFERENCES documents(id) ON DELETE CASCADE, UNIQUE | Parent document (one-to-one relationship) |
| data | jsonb | NOT NULL, DEFAULT '{}' | Structured extraction results |
| confidence_score | real | CHECK (confidence_score >= 0 AND confidence_score <= 1) | AI model confidence (0.0 to 1.0) |
| created_at | timestamp with time zone | DEFAULT NOW() | Extraction timestamp |
| updated_at | timestamp with time zone | DEFAULT NOW() | Re-analysis timestamp |

**JSONB Data Structure**:

The `data` column stores flexible schema-conforming to DocumentMetadata TypeScript interface:

```
{
  "customer": "ООО СтройМонтаж",
  "projectObject": "Складской комплекс",
  "address": "Московская область, г. Подольск, Промзона Север",
  "axes": [
    {"direction": "horizontal", "label": "А", "position": 0},
    {"direction": "horizontal", "label": "Б", "position": 6000},
    {"direction": "vertical", "label": "1", "position": 0}
  ],
  "elevationMarks": [0.000, 3.600, 7.200, 10.800],
  "billOfMaterials": [
    {
      "position": "1",
      "name": "Балка двутавровая 20Б1",
      "weight": 45.5,
      "quantity": 12,
      "totalWeight": 546.0
    }
  ]
}
```

**Indexes**:
- PRIMARY KEY on id (automatic)
- UNIQUE INDEX on document_id (enforces one-to-one relationship)
- GIN INDEX on data for JSONB query performance

**RLS Policy**: Users can access extracted data from documents they own

### Alignment with TypeScript Types

**Verification Table**:

| TypeScript Interface | Database Table | Field Mapping | Validation |
|---------------------|----------------|---------------|------------|
| Project | projects | id, name → 1:1 match | Sections stored as nested entities |
| Section | sections | id, name, projectId → id, name, project_id | Type enum values align |
| Document | documents | All core fields match | Storage path maps to storagePath |
| DocumentMetadata | extracted_data.data (JSONB) | Flexible schema contains all typed fields | JSONB validates against interface at application layer |
| Folder | Not in schema | See Migration Note below | Frontend folder concept maps to section directly |

**Migration Note**: The existing schema includes a `folders` table (lines 26-32 of 20241224_initial_schema.sql), but the task requirements specify a simpler three-level hierarchy (projects → sections → documents). This design removes the folders table to match the updated domain model where sections directly contain documents.

## Storage Architecture

### Supabase Storage Buckets

**Purpose**: Organize file uploads and generated outputs with clear separation

#### Bucket: blueprints

**Purpose**: Uploaded PDF drawings and design documentation

**Configuration**:

| Setting | Value | Rationale |
|---------|-------|-----------|
| Public Access | false | Contains proprietary engineering drawings |
| Allowed MIME Types | application/pdf, image/png, image/jpeg | Design documents in standard formats |
| Max File Size | 50 MB | Typical engineering drawing size |
| File Name Pattern | {project_id}/{section_code}/{timestamp}_{original_name} | Organized by project structure |

**RLS Policy**: Users can upload/read files in paths matching their project IDs

**Example Paths**:
- `a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a/КМ/1735123456_КМ-АР.pdf`
- `a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a/КЖ/1735123789_КЖ-Узлы.pdf`

#### Bucket: templates

**Purpose**: Excel blank forms used for report generation

**Configuration**:

| Setting | Value | Rationale |
|---------|-------|-----------|
| Public Access | false | Template library is user-specific |
| Allowed MIME Types | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | Excel .xlsx only |
| Max File Size | 10 MB | Templates are lightweight |
| File Name Pattern | {user_id}/{section_code}_{template_name}.xlsx | Organized by user and section type |

**RLS Policy**: Users can upload/read files in paths matching their user ID

**Example Paths**:
- `b8e4f3d2-5c6b-4e7f-9g0a-1c2d3e4f5g6h/КМ_Ведомость.xlsx`
- `b8e4f3d2-5c6b-4e7f-9g0a-1c2d3e4f5g6h/КЖ_Спецификация.xlsx`

#### Bucket: generated_docs

**Purpose**: Final executive documentation produced by AI generation workflow

**Configuration**:

| Setting | Value | Rationale |
|---------|-------|-----------|
| Public Access | false | Contains derived work from proprietary data |
| Allowed MIME Types | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf | Output formats |
| Max File Size | 25 MB | Generated reports with embedded data |
| File Name Pattern | {project_id}/{section_code}/generated_{timestamp}.xlsx | Organized by project and generation time |

**RLS Policy**: Users can upload/read files in paths matching their project IDs

**Example Paths**:
- `a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a/КМ/generated_1735150000.xlsx`
- `a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a/КЖ/generated_1735160000.pdf`

### Storage Integration Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase Storage
    participant Database
    participant Backend AI

    User->>Frontend: Upload PDF drawing
    Frontend->>Supabase Storage: Upload to blueprints bucket
    Supabase Storage-->>Frontend: Return storage_path
    Frontend->>Database: INSERT into documents (storage_path, status='uploaded')
    Database-->>Frontend: Return document_id
    
    User->>Frontend: Request Analysis
    Frontend->>Backend AI: POST /analyze (document_id)
    Backend AI->>Supabase Storage: Download file from storage_path
    Backend AI->>Backend AI: Extract engineering data
    Backend AI->>Database: INSERT into extracted_data (data, confidence_score)
    Backend AI->>Database: UPDATE documents SET status='completed'
    Backend AI-->>Frontend: Return metadata + confidence
```

## Row Level Security (RLS) Implementation

### Security Model

**Principle**: Zero-trust database access where PostgreSQL enforces authorization independently of application code

**Supabase Auth Integration**: All policies reference `auth.uid()` function to identify the current authenticated user

### RLS Policy Specifications

#### Projects Table Policies

**Policy: Users Own Projects**

- **Operation**: SELECT, INSERT, UPDATE, DELETE
- **Expression**: `user_id = auth.uid()`
- **Effect**: Users can only see and modify their own projects

**SQL Equivalent**:
```
Projects WHERE user_id = [current authenticated user id]
```

#### Sections Table Policies

**Policy: Users Access Sections Through Projects**

- **Operation**: SELECT, INSERT, UPDATE, DELETE
- **Expression**: `project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())`
- **Effect**: Users can access sections belonging to their projects

**SQL Equivalent**:
```
Sections WHERE project_id IN (user's project ids)
```

#### Documents Table Policies

**Policy: Users Access Documents Through Sections**

- **Operation**: SELECT, INSERT, UPDATE, DELETE
- **Expression**: `section_id IN (SELECT id FROM sections WHERE project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()))`
- **Effect**: Users can access documents in sections of their projects

**SQL Equivalent**:
```
Documents WHERE section_id IN (sections of user's projects)
```

#### Extracted Data Table Policies

**Policy: Users Access Extracted Data Through Documents**

- **Operation**: SELECT, INSERT, UPDATE, DELETE
- **Expression**: `document_id IN (SELECT id FROM documents WHERE section_id IN (SELECT id FROM sections WHERE project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())))`
- **Effect**: Users can access extracted data from their documents

**SQL Equivalent**:
```
Extracted_Data WHERE document_id IN (documents of user's projects)
```

### Storage Bucket Policies

#### Blueprints Bucket

**Policy: Project-Scoped Access**

- **Operation**: SELECT, INSERT
- **Path Pattern**: `{project_id}/*`
- **Expression**: `project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())`
- **Effect**: Users can upload/download files in folders matching their project IDs

#### Templates Bucket

**Policy: User-Scoped Access**

- **Operation**: SELECT, INSERT
- **Path Pattern**: `{user_id}/*`
- **Expression**: `storage.foldername(name)[1] = auth.uid()`
- **Effect**: Users can upload/download templates in their own folder

#### Generated Docs Bucket

**Policy: Project-Scoped Access**

- **Operation**: SELECT, INSERT
- **Path Pattern**: `{project_id}/*`
- **Expression**: `project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())`
- **Effect**: Users can access generated documents for their projects

## Environment Configuration

### Frontend Environment Variables

**File**: `/apps/frontend/.env.local`

**Variables**:

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| NEXT_PUBLIC_API_URL | Backend FastAPI endpoint | http://localhost:8000 |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | https://xyzproject.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public anonymous key for client auth | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |

**Security Note**: ANON_KEY is safe to expose in frontend code as RLS policies prevent unauthorized access.

**Usage Context**:
- Supabase client initialization in API client (`lib/api/client.ts`)
- Direct database queries from frontend (future real-time subscriptions)
- Storage upload/download operations

### Backend Environment Variables

**File**: `/apps/backend/.env`

**Variables**:

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:[password]@db.xyzproject.supabase.co:5432/postgres |
| SUPABASE_URL | Supabase project URL (same as frontend) | https://xyzproject.supabase.co |
| SUPABASE_SERVICE_ROLE_KEY | Service role key for admin operations | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (different from anon key) |

**Security Warning**: SERVICE_ROLE_KEY bypasses RLS policies and must never be exposed to frontend or version control.

**Usage Context**:
- Backend database operations requiring elevated permissions
- Bulk data operations during AI processing
- Administrative tasks (user data cleanup, migrations)

### Environment Setup Workflow

**Step 1**: Create Supabase project through dashboard

**Step 2**: Retrieve credentials from Project Settings → API

**Step 3**: Copy .env.example files to .env.local (frontend) and .env (backend)

**Step 4**: Replace placeholder values with actual credentials

**Step 5**: Add .env and .env.local to .gitignore (verify exclusion)

**Step 6**: For team members: Share credentials through secure channel (1Password, Bitwarden)

## SQL Migration Scripts

### Migration File Organization

**Location**: `/supabase/migrations/`

**Naming Convention**: `{timestamp}_{description}.sql`

**Execution Order**: Chronological by timestamp (Supabase CLI auto-sorts)

### Primary Migration: 20241225_database_setup.sql

**Purpose**: Create complete database schema with tables, indexes, triggers, and RLS policies

**Structure Outline**:

1. Enable UUID extension
2. Create tables (projects, sections, documents, extracted_data)
3. Create indexes for query optimization
4. Create updated_at triggers for automatic timestamp management
5. Enable RLS on all tables
6. Create RLS policies for multi-tenant isolation
7. Add table and column comments for documentation

**Key Implementation Details**:

**Cascading Deletes**: All foreign key relationships include `ON DELETE CASCADE` to maintain referential integrity

**Default Values**: 
- UUIDs auto-generated via `uuid_generate_v4()`
- Timestamps default to `NOW()`
- Document status defaults to `'uploaded'`
- Extracted data JSONB defaults to empty object `'{}'`

**Trigger Function**: Single `update_updated_at_column()` function reused across all tables

**JSONB Indexing**: GIN index on `extracted_data.data` for efficient querying of nested JSON fields

### Storage Bucket Setup Commands

**Purpose**: Initialize Supabase Storage buckets through SQL or Dashboard

**Bucket Creation**:

Buckets are created via Supabase Dashboard (Storage section) or using Supabase Management API. Each bucket requires:

1. **Name**: Unique bucket identifier
2. **Public/Private**: Access visibility
3. **File Size Limit**: Maximum upload size
4. **Allowed MIME Types**: Content type restrictions

**RLS Policy Creation**:

After bucket creation, storage policies are defined using:
- Policy name
- Allowed operations (SELECT, INSERT, UPDATE, DELETE)
- Path pattern matching
- SQL expression for authorization

**Note**: Storage policies are managed separately from table RLS policies in Supabase Dashboard → Storage → Policies.

## Integration with Existing Codebase

### Type Alignment Verification

**Existing TypeScript Interfaces** (packages/types/document.ts):

| TypeScript Type | Database Equivalent | Mapping Strategy |
|-----------------|---------------------|------------------|
| Project.id | projects.id (uuid) | Direct 1:1 mapping |
| Project.name | projects.name (text) | Direct 1:1 mapping |
| Project.sections | JOIN sections table | Nested query or array aggregation |
| Section.type | sections.code (text) | Enum values match ("КМ", "КЖ") |
| Document.status | documents.status (text) | Enum alignment required (see below) |
| Document.metadata | extracted_data.data (jsonb) | JOIN on document_id |
| DocumentMetadata.axes | jsonb array | Array of objects with direction/label/position |
| DocumentMetadata.billOfMaterials | jsonb array | Array of BOM entry objects |

**Enum Alignment Required**:

The TypeScript `DocumentStatus` enum has values: `analyzed`, `pending`, `draft`

The database `documents.status` enum has values: `uploaded`, `processing`, `completed`, `error`

**Resolution Strategy**: Update TypeScript enum to match database values for consistency:
- `analyzed` → `completed`
- `pending` → `processing`
- `draft` → `uploaded` (for documents not yet processed)
- Add `error` state to TypeScript enum

### API Client Updates

**Current State**: Frontend has `/apps/frontend/lib/api/client.ts` with contract definitions

**Required Changes**:

1. **Add Supabase Client Initialization**:
   - Import Supabase JavaScript library
   - Initialize client with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Export singleton instance

2. **Replace Mock Data Fetching**:
   - Update `getProjects()` to query `projects` table via Supabase client
   - Update `getDocuments(folderId)` to query `documents` table with section_id filter
   - Add metadata joining logic for document detail views

3. **Implement Upload Flow**:
   - Add `uploadDocument()` function using Supabase Storage upload API
   - Insert document record with storage_path reference
   - Return document_id for subsequent analysis requests

### Backend FastAPI Integration Points

**Current State**: Basic FastAPI structure in `/apps/backend/app/main.py`

**Required Additions**:

1. **Database Connection**:
   - Use DATABASE_URL to initialize PostgreSQL connection pool
   - Import Supabase Python library for storage operations

2. **Document Analysis Endpoint**:
   - POST `/api/analyze/{document_id}`
   - Fetch document from database
   - Download file from storage using storage_path
   - Extract engineering data (AI logic placeholder)
   - Insert extracted_data record
   - Update document status to `completed`

3. **Report Generation Endpoint**:
   - POST `/api/generate`
   - Accept templateId and documentMetadata in request body
   - Fetch template from templates bucket
   - Inject data using OpenPyXL (ExcelJS in Python)
   - Upload generated file to generated_docs bucket
   - Return download URL

## Data Flow Scenarios

### Scenario 1: Document Upload and Analysis

**User Action**: Upload PDF drawing from project section

**Flow**:

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase Storage
    participant Database
    participant Backend

    User->>Frontend: Select file and upload
    Frontend->>Frontend: Validate file type and size
    Frontend->>Supabase Storage: Upload to blueprints/{project_id}/{section_code}/
    Supabase Storage-->>Frontend: storage_path
    Frontend->>Database: INSERT documents (name, section_id, storage_path, status='uploaded')
    Database-->>Frontend: document_id
    Frontend->>Frontend: Display "Upload successful"
    
    User->>Frontend: Click "Analyze" button
    Frontend->>Backend: POST /api/analyze/{document_id}
    Backend->>Database: SELECT storage_path FROM documents WHERE id = document_id
    Backend->>Supabase Storage: Download file from storage_path
    Backend->>Backend: AI extraction logic
    Backend->>Database: INSERT extracted_data (document_id, data, confidence_score)
    Backend->>Database: UPDATE documents SET status='completed'
    Backend-->>Frontend: Return metadata + confidence
    Frontend->>Frontend: Display analysis results
```

### Scenario 2: Report Generation from Template

**User Action**: Generate executive documentation from analyzed data

**Flow**:

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant Supabase Storage

    User->>Frontend: Select template and source document
    Frontend->>Database: SELECT data FROM extracted_data WHERE document_id = [source_id]
    Database-->>Frontend: DocumentMetadata
    Frontend->>Backend: POST /api/generate (template_id, metadata)
    Backend->>Database: SELECT storage_path FROM documents WHERE id = template_id
    Backend->>Supabase Storage: Download template from storage_path
    Backend->>Backend: Load XLSX with OpenPyXL
    Backend->>Backend: Inject metadata into cells
    Backend->>Supabase Storage: Upload to generated_docs/{project_id}/{section_code}/
    Supabase Storage-->>Backend: generated_path
    Backend->>Database: INSERT documents (name, section_id, storage_path, type='executive', status='completed')
    Backend-->>Frontend: download_url
    Frontend->>Frontend: Display download link
```

### Scenario 3: Project Hierarchy Navigation

**User Action**: Browse project structure in Explorer panel

**Flow**:

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Database

    User->>Frontend: Load application
    Frontend->>Database: SELECT * FROM projects WHERE user_id = auth.uid()
    Database-->>Frontend: [Project 1, Project 2]
    Frontend->>Frontend: Render project nodes in tree
    
    User->>Frontend: Expand Project 1
    Frontend->>Database: SELECT * FROM sections WHERE project_id = [Project 1 id]
    Database-->>Frontend: [КМ Section, КЖ Section]
    Frontend->>Frontend: Render section child nodes
    
    User->>Frontend: Click КМ Section
    Frontend->>Database: SELECT * FROM documents WHERE section_id = [КМ id]
    Database-->>Frontend: [Document 1, Document 2, Document 3]
    Frontend->>Frontend: Display document cards in Workspace
```

## Migration from Mock Data

### Current Mock Data Structure

**Location**: `/apps/frontend/data/mockData.ts`

**Content**: Single hardcoded project with sections, folders, and documents

### Migration Strategy

**Phase 1: Dual Mode Operation**

- Keep mockData.ts active
- Add feature flag: `USE_REAL_DATABASE` in environment
- Implement database queries alongside mock data
- Toggle between mock and real data for testing

**Phase 2: Gradual Replacement**

- Replace project list fetching with database query
- Replace section fetching with database query
- Replace document fetching with database query
- Verify UI components work with real data structure

**Phase 3: Mock Data Removal**

- Remove mockData.ts file
- Remove feature flag
- Update DataContext to only use Supabase client
- Delete related mock data types if any

**Data Seeding for Development**:

Create SQL script `/supabase/migrations/20241225_seed_dev_data.sql`:
- Insert sample project for development user
- Insert КМ and КЖ sections
- Insert sample documents with mock metadata
- Only run in development environment (not production)

## Performance Optimization

### Indexing Strategy

**Purpose**: Ensure sub-100ms query response times for navigation operations

**Indexes Created**:

| Table | Index | Column(s) | Purpose |
|-------|-------|-----------|---------|
| projects | idx_projects_user_id | user_id | Fast user-scoped project lookup |
| sections | idx_sections_project_id | project_id | Fast section fetching for project expansion |
| documents | idx_documents_section_id | section_id | Fast document list retrieval |
| documents | idx_documents_status | status | Filter documents by processing state |
| extracted_data | idx_extracted_data_document_id | document_id (UNIQUE) | One-to-one relationship enforcement and fast joins |
| extracted_data | idx_extracted_data_jsonb | data (GIN) | JSONB query performance for metadata searches |

### Query Optimization Patterns

**N+1 Problem Prevention**:

Instead of:
1. Fetch project
2. For each project, fetch sections (N queries)
3. For each section, fetch documents (N×M queries)

Use:
- Single query with JOINs for hierarchical data
- PostgreSQL array aggregation for nested structures
- Batch fetching with WHERE IN clauses

**Example Optimized Query Pattern**:

Fetch entire project hierarchy in single query using:
- Common Table Expressions (CTEs)
- JSONB aggregation functions
- Lateral joins for nested arrays

### Caching Strategy

**Frontend Caching**:
- React Query for server state management (future enhancement)
- Cache project hierarchy for 5 minutes
- Invalidate cache on mutations (upload, delete, update)

**Database Caching**:
- Supabase connection pooling enabled
- PostgreSQL query plan caching automatic
- Materialized views for complex aggregations (if needed)

## Testing and Validation

### Database Schema Testing

**SQL Validation Checklist**:

- [ ] All tables created without errors
- [ ] Foreign key constraints enforced correctly
- [ ] Cascading deletes work as expected
- [ ] Default values applied on INSERT
- [ ] Triggers update updated_at timestamps
- [ ] JSONB data accepts valid DocumentMetadata structure
- [ ] Enum constraints reject invalid values

**Test Approach**:
- Run migration scripts in Supabase SQL Editor
- Execute test INSERT/UPDATE/DELETE operations
- Verify constraint violations throw appropriate errors
- Check trigger execution with sample updates

### RLS Policy Testing

**Policy Validation Checklist**:

- [ ] User A cannot SELECT User B's projects
- [ ] User A cannot INSERT sections into User B's projects
- [ ] User A cannot UPDATE documents in User B's sections
- [ ] User A cannot DELETE extracted_data from User B's documents
- [ ] Authenticated users can access their own data
- [ ] Anonymous users cannot access any data

**Test Approach**:
- Create test users in Supabase Auth
- Authenticate as User A and attempt to access User B's data
- Verify queries return empty results (not errors)
- Test edge cases (shared project IDs, null user_id)

### Storage Policy Testing

**Bucket Policy Validation Checklist**:

- [ ] User A cannot download files from User B's project folder in blueprints
- [ ] User A cannot upload files to User B's template folder
- [ ] Users can upload files to their own folders
- [ ] File size limits enforced
- [ ] MIME type restrictions enforced

**Test Approach**:
- Authenticate as test user
- Attempt to upload/download files in various paths
- Verify policy enforcement through Supabase Storage API responses

## Deployment and Operations

### Supabase Dashboard Configuration

**Step 1: Create Project**
- Navigate to Supabase Dashboard
- Click "New Project"
- Choose organization and region (select closest to primary users)
- Set database password (store securely)

**Step 2: Run Migrations**
- Install Supabase CLI: `npm install -g supabase`
- Link local project: `supabase link --project-ref [project-ref]`
- Run migrations: `supabase db push`
- Verify tables in Dashboard → Database → Tables

**Step 3: Configure Storage**
- Navigate to Storage section
- Create buckets: blueprints, templates, generated_docs
- Configure bucket settings (public/private, size limits)
- Add storage policies via Policies tab

**Step 4: Retrieve Credentials**
- Navigate to Project Settings → API
- Copy Supabase URL
- Copy anon (public) key
- Copy service_role (secret) key
- Update .env files in frontend and backend

### Monitoring and Maintenance

**Database Monitoring**:
- Supabase Dashboard → Database → Query Performance
- Monitor slow queries (> 1 second)
- Check index usage statistics
- Track table sizes and growth rates

**Storage Monitoring**:
- Supabase Dashboard → Storage → Usage
- Monitor storage quota consumption
- Track upload/download bandwidth
- Set up alerts for quota limits

**RLS Audit**:
- Periodically review RLS policies for security gaps
- Test policies with new user scenarios
- Verify cascading deletes don't leak data across tenants

### Backup and Recovery

**Automatic Backups**:
- Supabase performs daily automatic backups
- Point-in-time recovery available (Pro plan)
- Backups retained for 7 days (configurable)

**Manual Backup Strategy**:
- Export database schema: `supabase db dump --schema-only`
- Export data: `supabase db dump --data-only`
- Store exports in version control or cloud storage
- Test recovery process quarterly

## Security Considerations

### Authentication Flow

**Supabase Auth Integration**:

Although user authentication UI is out of scope for this phase, the database is designed to integrate with Supabase Auth when implemented.

**Expected Flow** (future):
1. User signs up/logs in via Supabase Auth
2. Supabase creates user record in `auth.users` table
3. User ID (UUID) available via `auth.uid()` in RLS policies
4. All database operations automatically scoped to authenticated user

**Preparation**:
- All tables reference `auth.users(id)` for user_id foreign keys
- RLS policies use `auth.uid()` function
- No custom authentication logic needed

### Data Protection

**Sensitive Data Handling**:

| Data Type | Storage Location | Protection Method |
|-----------|------------------|-------------------|
| User Credentials | Supabase Auth (managed) | Bcrypt hashing, rate limiting |
| Engineering Drawings | Supabase Storage (blueprints) | RLS path-based policies |
| Client Information | projects.client, extracted_data.data | RLS user-scoped policies |
| API Keys | Environment variables | Never committed to git |

**SQL Injection Prevention**:
- All database queries use parameterized statements
- Supabase client library auto-escapes inputs
- No raw SQL concatenation in application code

**XSS Prevention**:
- JSONB data sanitized before rendering in frontend
- React auto-escapes template variables
- Content Security Policy headers configured

## Out of Scope

The following items are explicitly excluded from this database setup phase:

- User authentication UI implementation (database prepared for future integration)
- AI analysis logic for document processing (endpoints defined, logic placeholder)
- Real-time collaboration features (Supabase Realtime subscriptions)
- Full-text search on document content (PostgreSQL full-text search indexes)
- Automated document versioning (revision history tables)
- Advanced analytics and reporting (aggregation views)
- Multi-language support for UI text (internationalization tables)
- Audit logging for compliance (change tracking tables)

## Success Criteria

This database infrastructure setup is considered complete when:

1. All tables created in Supabase with correct schema
2. RLS policies enabled and tested for all tables
3. Storage buckets configured with appropriate policies
4. Environment variables documented and examples updated
5. Migration scripts executable without errors
6. Type alignment verified between database and TypeScript
7. Frontend can query projects, sections, and documents via Supabase client
8. Backend can perform CRUD operations on all entities
9. Upload workflow stores files in correct storage paths
10. Multi-tenant isolation verified through RLS testing
11. Performance indexes created and query times validated
12. Documentation complete for team onboarding

## Next Steps

After database infrastructure setup:

1. **Update Frontend Data Layer**: Replace mock data with Supabase client queries
2. **Implement Upload Flow**: Integrate Supabase Storage upload in Frontend
3. **Build Analysis Endpoint**: Implement AI extraction logic in Backend
4. **Build Generation Endpoint**: Implement Excel template injection in Backend
5. **Add Authentication**: Implement Supabase Auth UI and session management
6. **Performance Testing**: Validate query performance with realistic data volumes
7. **Production Deployment**: Deploy Supabase project to production tier

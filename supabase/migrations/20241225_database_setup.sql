-- SYNAPSE Database Infrastructure Setup
-- Migration: Complete database schema with RLS policies
-- Created: 2024-12-25
-- Purpose: Establish multi-tenant database infrastructure for construction document management

-- ============================================================================
-- PART 1: EXTENSIONS AND SETUP
-- ============================================================================

-- Enable UUID extension for automatic ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PART 2: TABLE DEFINITIONS
-- ============================================================================

-- Projects Table
-- Top-level entity representing construction projects owned by authenticated users
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    client TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sections Table
-- Organizational divisions within projects (КМ - Metal Structures, КЖ - Reinforced Concrete)
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents Table
-- Uploaded files and generated reports within project sections
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    storage_path TEXT,
    status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'error')),
    type TEXT NOT NULL CHECK (type IN ('design', 'executive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extracted Data Table
-- AI-extracted engineering information from analyzed documents
CREATE TABLE extracted_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE UNIQUE,
    data JSONB NOT NULL DEFAULT '{}',
    confidence_score REAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PART 3: INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Projects indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Sections indexes
CREATE INDEX idx_sections_project_id ON sections(project_id);
CREATE INDEX idx_sections_code ON sections(code);

-- Documents indexes
CREATE INDEX idx_documents_section_id ON documents(section_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Extracted data indexes
CREATE INDEX idx_extracted_data_document_id ON extracted_data(document_id);
CREATE INDEX idx_extracted_data_jsonb ON extracted_data USING GIN (data);

-- ============================================================================
-- PART 4: TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Trigger function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_extracted_data_updated_at
    BEFORE UPDATE ON extracted_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 5: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_data ENABLE ROW LEVEL SECURITY;

-- Projects RLS Policies
-- Users can only access their own projects
CREATE POLICY "Users own projects"
    ON projects
    FOR ALL
    USING (user_id = auth.uid());

-- Sections RLS Policies
-- Users can access sections belonging to their projects
CREATE POLICY "Users access sections through projects"
    ON sections
    FOR ALL
    USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

-- Documents RLS Policies
-- Users can access documents in sections of their projects
CREATE POLICY "Users access documents through sections"
    ON documents
    FOR ALL
    USING (
        section_id IN (
            SELECT id FROM sections WHERE project_id IN (
                SELECT id FROM projects WHERE user_id = auth.uid()
            )
        )
    );

-- Extracted Data RLS Policies
-- Users can access extracted data from their documents
CREATE POLICY "Users access extracted data through documents"
    ON extracted_data
    FOR ALL
    USING (
        document_id IN (
            SELECT id FROM documents WHERE section_id IN (
                SELECT id FROM sections WHERE project_id IN (
                    SELECT id FROM projects WHERE user_id = auth.uid()
                )
            )
        )
    );

-- ============================================================================
-- PART 6: TABLE AND COLUMN COMMENTS FOR DOCUMENTATION
-- ============================================================================

-- Table comments
COMMENT ON TABLE projects IS 'Top-level construction projects owned by authenticated users';
COMMENT ON TABLE sections IS 'Organizational divisions within projects (КМ - Metal Structures, КЖ - Reinforced Concrete)';
COMMENT ON TABLE documents IS 'Uploaded design files and generated executive documentation';
COMMENT ON TABLE extracted_data IS 'AI-extracted engineering metadata from analyzed documents';

-- Projects table column comments
COMMENT ON COLUMN projects.id IS 'Unique project identifier (UUID)';
COMMENT ON COLUMN projects.user_id IS 'Owner reference from Supabase Auth users table';
COMMENT ON COLUMN projects.name IS 'Project display name';
COMMENT ON COLUMN projects.address IS 'Construction site physical address';
COMMENT ON COLUMN projects.client IS 'Client organization name';

-- Sections table column comments
COMMENT ON COLUMN sections.id IS 'Unique section identifier (UUID)';
COMMENT ON COLUMN sections.project_id IS 'Parent project reference';
COMMENT ON COLUMN sections.name IS 'Section display name';
COMMENT ON COLUMN sections.code IS 'Section code identifier (e.g., КМ, КЖ)';

-- Documents table column comments
COMMENT ON COLUMN documents.id IS 'Unique document identifier (UUID)';
COMMENT ON COLUMN documents.section_id IS 'Parent section reference';
COMMENT ON COLUMN documents.name IS 'File name with extension';
COMMENT ON COLUMN documents.storage_path IS 'Supabase Storage bucket path (null for drafts)';
COMMENT ON COLUMN documents.status IS 'Processing state: uploaded, processing, completed, error';
COMMENT ON COLUMN documents.type IS 'Document category: design (input) or executive (output)';

-- Extracted data table column comments
COMMENT ON COLUMN extracted_data.id IS 'Unique record identifier (UUID)';
COMMENT ON COLUMN extracted_data.document_id IS 'Parent document reference (one-to-one relationship)';
COMMENT ON COLUMN extracted_data.data IS 'JSONB structure containing DocumentMetadata (customer, axes, BOM, etc.)';
COMMENT ON COLUMN extracted_data.confidence_score IS 'AI model confidence score (0.0 to 1.0)';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor or via CLI: supabase db push
-- 2. Create storage buckets: blueprints, templates, generated_docs
-- 3. Configure storage RLS policies in Supabase Dashboard
-- 4. Run seed data migration (20241225_seed_dev_data.sql) for development
-- ============================================================================
-- SYNAPSE Database Infrastructure Setup
-- Migration: Complete database schema with RLS policies
-- Created: 2024-12-25
-- Purpose: Establish multi-tenant database infrastructure for construction document management

-- ============================================================================
-- PART 1: EXTENSIONS AND SETUP
-- ============================================================================

-- Enable UUID extension for automatic ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PART 2: TABLE DEFINITIONS
-- ============================================================================

-- Projects Table
-- Top-level entity representing construction projects owned by authenticated users
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    client TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sections Table
-- Organizational divisions within projects (КМ - Metal Structures, КЖ - Reinforced Concrete)
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents Table
-- Uploaded files and generated reports within project sections
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    storage_path TEXT,
    status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'error')),
    type TEXT NOT NULL CHECK (type IN ('design', 'executive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extracted Data Table
-- AI-extracted engineering information from analyzed documents
CREATE TABLE extracted_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE UNIQUE,
    data JSONB NOT NULL DEFAULT '{}',
    confidence_score REAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PART 3: INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Projects indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Sections indexes
CREATE INDEX idx_sections_project_id ON sections(project_id);
CREATE INDEX idx_sections_code ON sections(code);

-- Documents indexes
CREATE INDEX idx_documents_section_id ON documents(section_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Extracted data indexes
CREATE INDEX idx_extracted_data_document_id ON extracted_data(document_id);
CREATE INDEX idx_extracted_data_jsonb ON extracted_data USING GIN (data);

-- ============================================================================
-- PART 4: TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Trigger function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_extracted_data_updated_at
    BEFORE UPDATE ON extracted_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 5: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_data ENABLE ROW LEVEL SECURITY;

-- Projects RLS Policies
-- Users can only access their own projects
CREATE POLICY "Users own projects"
    ON projects
    FOR ALL
    USING (user_id = auth.uid());

-- Sections RLS Policies
-- Users can access sections belonging to their projects
CREATE POLICY "Users access sections through projects"
    ON sections
    FOR ALL
    USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

-- Documents RLS Policies
-- Users can access documents in sections of their projects
CREATE POLICY "Users access documents through sections"
    ON documents
    FOR ALL
    USING (
        section_id IN (
            SELECT id FROM sections WHERE project_id IN (
                SELECT id FROM projects WHERE user_id = auth.uid()
            )
        )
    );

-- Extracted Data RLS Policies
-- Users can access extracted data from their documents
CREATE POLICY "Users access extracted data through documents"
    ON extracted_data
    FOR ALL
    USING (
        document_id IN (
            SELECT id FROM documents WHERE section_id IN (
                SELECT id FROM sections WHERE project_id IN (
                    SELECT id FROM projects WHERE user_id = auth.uid()
                )
            )
        )
    );

-- ============================================================================
-- PART 6: TABLE AND COLUMN COMMENTS FOR DOCUMENTATION
-- ============================================================================

-- Table comments
COMMENT ON TABLE projects IS 'Top-level construction projects owned by authenticated users';
COMMENT ON TABLE sections IS 'Organizational divisions within projects (КМ - Metal Structures, КЖ - Reinforced Concrete)';
COMMENT ON TABLE documents IS 'Uploaded design files and generated executive documentation';
COMMENT ON TABLE extracted_data IS 'AI-extracted engineering metadata from analyzed documents';

-- Projects table column comments
COMMENT ON COLUMN projects.id IS 'Unique project identifier (UUID)';
COMMENT ON COLUMN projects.user_id IS 'Owner reference from Supabase Auth users table';
COMMENT ON COLUMN projects.name IS 'Project display name';
COMMENT ON COLUMN projects.address IS 'Construction site physical address';
COMMENT ON COLUMN projects.client IS 'Client organization name';

-- Sections table column comments
COMMENT ON COLUMN sections.id IS 'Unique section identifier (UUID)';
COMMENT ON COLUMN sections.project_id IS 'Parent project reference';
COMMENT ON COLUMN sections.name IS 'Section display name';
COMMENT ON COLUMN sections.code IS 'Section code identifier (e.g., КМ, КЖ)';

-- Documents table column comments
COMMENT ON COLUMN documents.id IS 'Unique document identifier (UUID)';
COMMENT ON COLUMN documents.section_id IS 'Parent section reference';
COMMENT ON COLUMN documents.name IS 'File name with extension';
COMMENT ON COLUMN documents.storage_path IS 'Supabase Storage bucket path (null for drafts)';
COMMENT ON COLUMN documents.status IS 'Processing state: uploaded, processing, completed, error';
COMMENT ON COLUMN documents.type IS 'Document category: design (input) or executive (output)';

-- Extracted data table column comments
COMMENT ON COLUMN extracted_data.id IS 'Unique record identifier (UUID)';
COMMENT ON COLUMN extracted_data.document_id IS 'Parent document reference (one-to-one relationship)';
COMMENT ON COLUMN extracted_data.data IS 'JSONB structure containing DocumentMetadata (customer, axes, BOM, etc.)';
COMMENT ON COLUMN extracted_data.confidence_score IS 'AI model confidence score (0.0 to 1.0)';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor or via CLI: supabase db push
-- 2. Create storage buckets: blueprints, templates, generated_docs
-- 3. Configure storage RLS policies in Supabase Dashboard
-- 4. Run seed data migration (20241225_seed_dev_data.sql) for development
-- ============================================================================

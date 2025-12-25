# SYNAPSE Supabase Database & Storage Infrastructure

This directory contains Supabase database migrations, configuration, and setup instructions for the SYNAPSE construction document management platform.

## Overview

SYNAPSE uses Supabase as its backend-as-a-service platform, providing:
- **PostgreSQL Database**: Multi-tenant project and document management
- **Row Level Security (RLS)**: Database-level authorization and data isolation
- **Storage Buckets**: File storage for blueprints, templates, and generated documents
- **Authentication**: User management (future integration)

## Quick Start

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Choose organization and region (select closest to your users)
4. Set a strong database password (save it securely)
5. Wait for project provisioning (~2 minutes)

### 2. Run Database Migrations

**Option A: Using Supabase Dashboard (Recommended for first setup)**

1. Navigate to your project in Supabase Dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click "New Query"
4. Copy the contents of `migrations/20241225_database_setup.sql`
5. Paste into the SQL editor
6. Click "Run" or press Ctrl+Enter
7. Verify tables are created: **Database** → **Tables**

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI globally
npm install -g supabase

# Link your local project to Supabase
cd /path/to/SYNAPSE
supabase link --project-ref your-project-ref

# Push migrations to Supabase
supabase db push
```

### 3. Configure Storage Buckets

Navigate to **Storage** in Supabase Dashboard and create three buckets:

#### Bucket 1: blueprints

- **Name**: `blueprints`
- **Public**: ❌ No (Private)
- **Allowed MIME types**: 
  - `application/pdf`
  - `image/png`
  - `image/jpeg`
- **File size limit**: 50 MB

#### Bucket 2: templates

- **Name**: `templates`
- **Public**: ❌ No (Private)
- **Allowed MIME types**: 
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **File size limit**: 10 MB

#### Bucket 3: generated_docs

- **Name**: `generated_docs`
- **Public**: ❌ No (Private)
- **Allowed MIME types**: 
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - `application/pdf`
- **File size limit**: 25 MB

### 4. Configure Storage Policies

For each bucket, create Row Level Security policies:

**For blueprints bucket:**

```sql
-- Policy: Allow users to upload to their project folders
CREATE POLICY "Users can upload blueprints to their projects"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blueprints' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE user_id = auth.uid()
  )
);

-- Policy: Allow users to read from their project folders
CREATE POLICY "Users can read blueprints from their projects"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'blueprints' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE user_id = auth.uid()
  )
);
```

**For templates bucket:**

```sql
-- Policy: Allow users to upload to their own folder
CREATE POLICY "Users can upload their templates"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'templates' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to read their own templates
CREATE POLICY "Users can read their templates"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'templates' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**For generated_docs bucket:**

```sql
-- Policy: Allow users to upload to their project folders
CREATE POLICY "Users can upload generated docs to their projects"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'generated_docs' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE user_id = auth.uid()
  )
);

-- Policy: Allow users to read from their project folders
CREATE POLICY "Users can read generated docs from their projects"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'generated_docs' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE user_id = auth.uid()
  )
);
```

### 5. Get API Credentials

1. Navigate to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: Used in frontend (safe to expose)
   - **service_role key**: Used in backend (keep secret!)

### 6. Configure Environment Variables

**Frontend** (`apps/frontend/.env.local`):
```bash
cp apps/frontend/.env.local.example apps/frontend/.env.local
# Edit .env.local and replace placeholders with actual values
```

**Backend** (`apps/backend/.env`):
```bash
cp apps/backend/.env.example apps/backend/.env
# Edit .env and replace placeholders with actual values
```

**⚠️ IMPORTANT**: Never commit `.env` or `.env.local` files to version control!

## Database Schema

### Tables Overview

| Table | Purpose | Parent Table |
|-------|---------|-------------|
| `projects` | Construction projects | `auth.users` |
| `sections` | Project sections (КМ, КЖ) | `projects` |
| `documents` | Uploaded and generated files | `sections` |
| `extracted_data` | AI-extracted metadata | `documents` |

### Entity Relationships

```
auth.users (Supabase Auth)
    ↓
projects (1:N)
    ↓
sections (1:N)
    ↓
documents (1:1)
    ↓
extracted_data
```

### Key Features

✅ **Row Level Security (RLS)**: All tables have RLS policies enforcing user-scoped access

✅ **Cascading Deletes**: Deleting a project automatically removes all related sections, documents, and metadata

✅ **Automatic Timestamps**: `created_at` and `updated_at` managed by database triggers

✅ **JSONB for Flexibility**: `extracted_data.data` stores semi-structured engineering metadata

✅ **Performance Indexes**: Optimized for project hierarchy navigation

## Storage Architecture

### File Organization Patterns

**Blueprints Bucket** (Design inputs):
```
blueprints/
├── {project-uuid-1}/
│   ├── КМ/
│   │   ├── 1735123456_КМ-АР.pdf
│   │   └── 1735123789_КМ-Ведомость.xlsx
│   └── КЖ/
│       └── 1735124000_КЖ-АР.pdf
└── {project-uuid-2}/
    └── КМ/
        └── ...
```

**Templates Bucket** (User-specific templates):
```
templates/
├── {user-uuid-1}/
│   ├── КМ_Ведомость.xlsx
│   └── КЖ_Спецификация.xlsx
└── {user-uuid-2}/
    └── ...
```

**Generated Docs Bucket** (AI outputs):
```
generated_docs/
├── {project-uuid-1}/
│   ├── КМ/
│   │   ├── generated_1735150000.xlsx
│   │   └── generated_1735160000.pdf
│   └── КЖ/
│       └── ...
└── {project-uuid-2}/
    └── ...
```

## Development Seed Data

### Loading Sample Data

**⚠️ Development Only**: The seed data script should only be run in development/staging environments.

**Steps**:

1. Create a test user in Supabase Auth:
   - Navigate to **Authentication** → **Users**
   - Click "Add User"
   - Enter email and password
   - Copy the user's UUID

2. Edit `migrations/20241225_seed_dev_data.sql`:
   - Replace `'00000000-0000-0000-0000-000000000000'` with the actual test user UUID

3. Run the seed script:
   - Open **SQL Editor** in Supabase Dashboard
   - Copy contents of `migrations/20241225_seed_dev_data.sql`
   - Paste and run

4. Verify data:
   - Check **Database** → **Tables** → `projects`
   - You should see "Складской комплекс" project
   - Check `sections`, `documents`, and `extracted_data` tables

### Sample Data Summary

The seed script creates:
- 1 project: "Складской комплекс" (Warehouse Complex)
- 2 sections: КМ (Metal Structures), КЖ (Reinforced Concrete)
- 6 documents: Design drawings and templates
- 2 extracted data records: Sample engineering metadata

## Migrations Management

### Migration Files

| File | Purpose | Status |
|------|---------|--------|
| `20241224_initial_schema.sql` | Original schema (outdated) | ⚠️ Legacy |
| `20241225_database_setup.sql` | **Current schema** | ✅ Active |
| `20241225_seed_dev_data.sql` | Development test data | ⚠️ Dev Only |

### Creating New Migrations

```bash
# Generate new migration file
supabase migration new add_new_feature

# Edit the generated file in migrations/ directory
# Then push to Supabase
supabase db push
```

### Migration Best Practices

1. **Always test locally first**: Use Supabase CLI local development
2. **One logical change per migration**: Don't mix unrelated schema changes
3. **Include rollback commands**: Comment out DOWN migration SQL for reference
4. **Verify RLS policies**: Test with different user accounts
5. **Document breaking changes**: Update README and API documentation

## Troubleshooting

### Issue: Tables not visible after migration

**Solution**: Verify migration ran successfully:
```sql
SELECT * FROM supabase_migrations.schema_migrations;
```

### Issue: RLS policies blocking legitimate queries

**Solution**: Check current user context:
```sql
SELECT auth.uid(); -- Should return your user UUID when authenticated
```

**Temporarily disable RLS for testing** (development only):
```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
-- Remember to re-enable!
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

### Issue: Storage upload fails with permission error

**Solution**: Verify storage policies exist:
```sql
SELECT * FROM storage.policies WHERE bucket_id = 'blueprints';
```

Check file path matches expected pattern (e.g., `{project_id}/КМ/filename.pdf`)

### Issue: Foreign key constraint violation

**Solution**: Ensure parent records exist before inserting children:
```sql
-- Check project exists before creating section
SELECT id FROM projects WHERE id = 'your-project-uuid';
```

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Storage buckets set to private
- [ ] Storage policies created for all buckets
- [ ] Service role key stored securely (never in frontend)
- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] Database password is strong and unique
- [ ] Test user cannot access other users' data
- [ ] Anonymous users cannot query any data

## Next Steps

After database setup:

1. **Frontend Integration**: Update `apps/frontend/lib/api/client.ts` to use Supabase client
2. **Backend Integration**: Add Supabase client initialization in FastAPI
3. **Authentication**: Implement Supabase Auth UI in frontend
4. **Testing**: Verify RLS policies with multiple test users
5. **Monitoring**: Set up Supabase Dashboard alerts for query performance

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [PostgreSQL JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)

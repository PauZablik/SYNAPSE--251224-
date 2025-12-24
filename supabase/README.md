# Supabase Configuration

This directory contains Supabase database migrations and configuration.

## Setup

### Option 1: Use Supabase Cloud

1. Create a new project at https://supabase.com
2. Copy your project URL and API keys
3. Update environment variables in frontend and backend `.env` files

### Option 2: Use Supabase CLI (Local Development)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Initialize Supabase:
```bash
supabase init
```

3. Start local Supabase:
```bash
supabase start
```

4. The local instance will be available at:
- API: http://localhost:54321
- Studio: http://localhost:54323
- PostgreSQL: localhost:54322

## Migrations

The `migrations/` directory contains SQL migration files for database schema.

### Running Migrations

For Supabase Cloud:
```bash
supabase db push
```

For Local Development:
```bash
supabase migration up
```

### Creating New Migrations

```bash
supabase migration new migration_name
```

## Storage Buckets

The platform uses three storage buckets:

1. **uploads**: User-uploaded documents (PDFs, Excel files)
2. **templates**: Template documents for report generation
3. **generated**: AI-generated documents

### Creating Buckets

Execute in Supabase Dashboard or SQL Editor:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('uploads', 'uploads', false),
  ('templates', 'templates', false),
  ('generated', 'generated', false);

-- Set up storage policies (example for uploads bucket)
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Users can view their files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'uploads');
```

## Database Schema

See `migrations/20241224_initial_schema.sql` for the complete schema definition.

### Tables

- `projects`: Top-level construction projects
- `sections`: Project sections (КМ, КЖ)
- `folders`: Organizational folders
- `documents`: Document records
- `document_metadata`: AI-extracted metadata

### Relationships

```
projects (1) ---> (*) sections
sections (1) ---> (*) folders
folders (1) ---> (*) documents
documents (1) ---> (1) document_metadata
```

## Environment Variables

Add these to your `.env` files:

**Frontend** (`apps/frontend/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Backend** (`apps/backend/.env`):
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
DATABASE_URL=your_postgres_connection_string
```

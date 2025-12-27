# SYNAPSE - Supabase Integration Guide

## Overview
This guide explains how to connect the SYNAPSE frontend to a real Supabase database and launch the application with live data.

## Prerequisites
- Node.js 18+ installed
- Supabase project set up with the database schema
- Database migration files executed (20241225_database_setup.sql and 20241225_seed_dev_data.sql)
- Supabase project URL and anon key ready for configuration

## Step-by-Step Setup Guide

### 1. Environment Configuration
1. Navigate to your Supabase project dashboard
2. Go to Project Settings → API
3. Copy the Project URL and set it as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the anon key and set it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. A `.env.local` file has already been created with placeholder values in the frontend directory
6. Update the values in `apps/frontend/.env.local` with your actual Supabase credentials:
   - Replace `https://your-project.supabase.co` with your actual Supabase project URL
   - Replace `your_supabase_anon_key_here` with your actual Supabase anon key

### 2. Install Dependencies
```bash
# At the root of the project
npm install

# Install Supabase client in frontend
cd apps/frontend
npm install @supabase/supabase-js
```

### 3. Database Setup
If you haven't already, run the database migration files:
1. Execute `20241225_database_setup.sql` to create the schema
2. Execute `20241225_seed_dev_data.sql` to add sample data (optional)

### 4. Start the Development Server
```bash
# Terminal 1: Start the frontend
cd apps/frontend
npm run dev

# Terminal 2: Start the backend (if needed)
cd apps/backend
uvicorn app.main:app --reload
```

## New Features Implemented

### 1. Real Data Fetching
- All hardcoded mock data has been replaced with real Supabase queries
- Data is fetched from `projects`, `sections`, and `documents` tables
- Empty states are handled gracefully

### 2. Create Project Functionality
- Added "New Project" button to the toolbar
- Connects to Supabase to create new projects in the `projects` table
- Automatically refreshes the sidebar to show the new project
- Uses current auth.uid() for the user_id field

### 3. Improved UI Components
- Updated status badges to match database schema (uploaded, processing, completed, error)
- Enhanced folder structure with virtual folders for better UI consistency
- Maintained all previous UI improvements (teal theme, collapsible sidebar, theme toggle)

### 4. Data Flow Architecture
- Frontend now connects directly to Supabase database
- Real-time data synchronization through Supabase client
- Proper error handling and loading states

## Troubleshooting

### Common Issues:
1. **Connection Refused**: Ensure your Supabase project URL and keys are correct in `.env.local`
2. **Empty Project List**: Make sure database migration files have been executed
3. **Auth Issues**: Verify that Row Level Security (RLS) policies are enabled in Supabase dashboard

### Verification Steps:
1. Check that your Supabase project has RLS policies enabled for all tables
2. Verify that your database contains data in the projects, sections, and documents tables
3. Confirm that your `.env.local` file has the correct Supabase credentials

## Accessing the Application
1. Frontend: http://localhost:3000
2. The application will automatically fetch data from your Supabase database
3. Use the "New Project" button to create projects directly in the database
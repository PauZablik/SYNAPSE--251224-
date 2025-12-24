# SYNAPSE Platform

Professional engineering document management platform for Construction Technical Office (PTO) engineers. Features IDE-style interface with AI-powered document analysis and generation capabilities.

## Architecture

This is a monorepo containing:

- **Frontend**: Next.js + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (Python) with Supabase integration
- **Types Package**: Shared TypeScript type definitions
- **Supabase**: Database schema and storage configuration

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PauZablik/SYNAPSE-251224.git
cd "SYNAPSE (251224)"
```

2. Install frontend dependencies:
```bash
cd apps/frontend
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

### Backend Setup (Optional)

1. Navigate to backend directory:
```bash
cd apps/backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the API server:
```bash
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000

## Project Structure

```
SYNAPSE (251224)/
├── apps/
│   ├── frontend/          # Next.js application
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── context/       # React Context providers
│   │   ├── data/          # Mock data
│   │   ├── lib/           # Utilities and API client
│   │   └── types/         # TypeScript types
│   └── backend/           # FastAPI application
│       ├── app/
│       │   ├── main.py
│       │   └── routers/
│       └── requirements.txt
├── packages/
│   └── types/             # Shared TypeScript types
├── supabase/              # Database migrations and config
│   ├── migrations/
│   └── README.md
├── package.json           # Root package.json
└── README.md
```

## Features

### Current Implementation (Phase 1)

✅ **Monorepo Architecture**: Scalable structure for independent development  
✅ **4-Zone IDE Layout**: Toolbar, Explorer, Workspace, AI Console  
✅ **Project Explorer**: Hierarchical tree navigation with expand/collapse  
✅ **Document Management**: File list view with cards and detail view  
✅ **Engineering Design**: Professional dark theme with construction orange accent  
✅ **Mock Data**: Complete "Складской комплекс" project with metadata  
✅ **Type Safety**: Fully typed with TypeScript  
✅ **API Client**: Foundation for backend integration  

### Future Implementation

⏳ **User Authentication**: Supabase Auth integration  
⏳ **File Upload**: Real file upload to Supabase Storage  
⏳ **AI Analysis**: Document metadata extraction  
⏳ **Report Generation**: Template-based document generation with ExcelJS  
⏳ **Real-time Updates**: Live collaboration features  

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Component library
- **Lucide React**: Icon system

### Backend
- **FastAPI**: Modern Python API framework
- **Supabase**: PostgreSQL database and storage
- **OpenPyXL**: Excel file processing

### Fonts
- **Inter**: Interface text
- **JetBrains Mono**: Technical data (IDs, coordinates, BOM)

## Development

### Frontend Development

```bash
cd apps/frontend
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint
```

### Backend Development

```bash
cd apps/backend
uvicorn app.main:app --reload   # Start with hot reload
```

### Type Checking

```bash
cd apps/frontend
npx tsc --noEmit
```

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)

```
DATABASE_URL=your_postgres_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
```

## Design System

### Colors

- Background: `#020617` (slate-950)
- Panels: `#0f172a` (slate-900)
- Borders: `#334155` (slate-800)
- Accent: `#F59E0B` (construction orange)
- Text Primary: `#F8FAFC`
- Text Secondary: `#94A3B8`

### Layout

- Toolbar: 64px height
- Explorer: 280px width
- AI Console: 200px height
- Workspace: Flexible

## Mock Data

The application comes with pre-loaded mock data representing a "Складской комплекс" (Warehouse Complex) project:

- **КМ (Metal Structures)**: 3 project documents + 1 template
- **КЖ (Reinforced Concrete)**: 1 project document + 1 template
- Full metadata with axes, elevation marks, and bill of materials

## Contributing

This is a demonstration project for PauZablik's SYNAPSE platform.

## License

Proprietary - All rights reserved

## Contact

GitHub: [@PauZablik](https://github.com/PauZablik)  
Repository: [SYNAPSE-251224](https://github.com/PauZablik/SYNAPSE-251224)
# SYNAPSE Platform

Professional engineering document management platform for Construction Technical Office (PTO) engineers. Features IDE-style interface with AI-powered document analysis and generation capabilities.

## Architecture

This is a monorepo containing:

- **Frontend**: Next.js + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (Python) with Supabase integration
- **Types Package**: Shared TypeScript type definitions
- **Supabase**: Database schema and storage configuration

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PauZablik/SYNAPSE-251224.git
cd "SYNAPSE (251224)"
```

2. Install frontend dependencies:
```bash
cd apps/frontend
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

### Backend Setup (Optional)

1. Navigate to backend directory:
```bash
cd apps/backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the API server:
```bash
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000

## Project Structure

```
SYNAPSE (251224)/
├── apps/
│   ├── frontend/          # Next.js application
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── context/       # React Context providers
│   │   ├── data/          # Mock data
│   │   ├── lib/           # Utilities and API client
│   │   └── types/         # TypeScript types
│   └── backend/           # FastAPI application
│       ├── app/
│       │   ├── main.py
│       │   └── routers/
│       └── requirements.txt
├── packages/
│   └── types/             # Shared TypeScript types
├── supabase/              # Database migrations and config
│   ├── migrations/
│   └── README.md
├── package.json           # Root package.json
└── README.md
```

## Features

### Current Implementation (Phase 1)

✅ **Monorepo Architecture**: Scalable structure for independent development  
✅ **4-Zone IDE Layout**: Toolbar, Explorer, Workspace, AI Console  
✅ **Project Explorer**: Hierarchical tree navigation with expand/collapse  
✅ **Document Management**: File list view with cards and detail view  
✅ **Engineering Design**: Professional dark theme with construction orange accent  
✅ **Mock Data**: Complete "Складской комплекс" project with metadata  
✅ **Type Safety**: Fully typed with TypeScript  
✅ **API Client**: Foundation for backend integration  

### Future Implementation

⏳ **User Authentication**: Supabase Auth integration  
⏳ **File Upload**: Real file upload to Supabase Storage  
⏳ **AI Analysis**: Document metadata extraction  
⏳ **Report Generation**: Template-based document generation with ExcelJS  
⏳ **Real-time Updates**: Live collaboration features  

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Component library
- **Lucide React**: Icon system

### Backend
- **FastAPI**: Modern Python API framework
- **Supabase**: PostgreSQL database and storage
- **OpenPyXL**: Excel file processing

### Fonts
- **Inter**: Interface text
- **JetBrains Mono**: Technical data (IDs, coordinates, BOM)

## Development

### Frontend Development

```bash
cd apps/frontend
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint
```

### Backend Development

```bash
cd apps/backend
uvicorn app.main:app --reload   # Start with hot reload
```

### Type Checking

```bash
cd apps/frontend
npx tsc --noEmit
```

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)

```
DATABASE_URL=your_postgres_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
```

## Design System

### Colors

- Background: `#020617` (slate-950)
- Panels: `#0f172a` (slate-900)
- Borders: `#334155` (slate-800)
- Accent: `#F59E0B` (construction orange)
- Text Primary: `#F8FAFC`
- Text Secondary: `#94A3B8`

### Layout

- Toolbar: 64px height
- Explorer: 280px width
- AI Console: 200px height
- Workspace: Flexible

## Mock Data

The application comes with pre-loaded mock data representing a "Складской комплекс" (Warehouse Complex) project:

- **КМ (Metal Structures)**: 3 project documents + 1 template
- **КЖ (Reinforced Concrete)**: 1 project document + 1 template
- Full metadata with axes, elevation marks, and bill of materials

## Contributing

This is a demonstration project for PauZablik's SYNAPSE platform.

## License

Proprietary - All rights reserved

## Contact

GitHub: [@PauZablik](https://github.com/PauZablik)  
Repository: [SYNAPSE-251224](https://github.com/PauZablik/SYNAPSE-251224)

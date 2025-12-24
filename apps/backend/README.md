# SYNAPSE Backend

FastAPI backend for the SYNAPSE platform.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file with environment variables:
```
DATABASE_URL=your_supabase_postgres_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
```

5. Run the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

API documentation (Swagger UI) will be available at http://localhost:8000/docs

## Project Structure

```
app/
├── __init__.py
├── main.py              # FastAPI app initialization
└── routers/
    ├── __init__.py
    └── documents.py     # Document-related endpoints
```

## Future Development

This is a basic structure. Future implementations will include:
- Database models and ORM (SQLAlchemy)
- Supabase Storage integration
- AI analysis pipeline integration
- ExcelJS template processing
- Authentication and authorization
- Error handling and logging

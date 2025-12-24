from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import documents

app = FastAPI(
    title="SYNAPSE API",
    description="Engineering Document Management Platform API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router, prefix="/documents", tags=["documents"])

@app.get("/")
async def root():
    return {
        "message": "SYNAPSE API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

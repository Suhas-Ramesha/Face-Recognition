from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from pathlib import Path
from face_recognition_service import face_recognition_service

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://face-recognition-psi-tan.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create temporary directory for uploaded files
UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/api/recognize")
async def recognize_face(file: UploadFile = File(...)):
    """Endpoint to recognize a face from an uploaded image."""
    temp_file = UPLOAD_DIR / file.filename
    try:
        with temp_file.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        result = await face_recognition_service.recognize_face(str(temp_file))
        return result
    finally:
        if temp_file.exists():
            temp_file.unlink()

@app.post("/api/add-known-face")
async def add_known_face(
    file: UploadFile = File(...),
    person_id: str = Form(...)
):
    """Endpoint to add a known face to the database."""
    temp_file = UPLOAD_DIR / file.filename
    try:
        with temp_file.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        result = await face_recognition_service.add_known_face(str(temp_file), person_id)
        return result
    finally:
        if temp_file.exists():
            temp_file.unlink()

@app.get("/api/people")
async def get_people():
    """Get list of all registered people."""
    return await face_recognition_service.get_all_people()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import tempfile

from pdf_reader import extract_text_from_pdf
from summarizer import summarize_pdf, create_study_notes

app = FastAPI(title="AI Study Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return {}


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        contents = await file.read()

        # Geçici dosya oluştur
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(contents)
            temp_path = temp_file.name

        try:
            text = extract_text_from_pdf(temp_path)

            if not text or len(text.strip()) < 10:
                raise HTTPException(status_code=400, detail="Could not extract text from PDF")

            summary = summarize_pdf(text)
            return summary

        finally:
            # Geçici dosyayı temizle
            if os.path.exists(temp_path):
                os.remove(temp_path)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@app.post("/study-notes-from-pdf")
async def study_notes_from_pdf(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        contents = await file.read()

        # Geçici dosya oluştur
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(contents)
            temp_path = temp_file.name

        try:
            text = extract_text_from_pdf(temp_path)

            if not text or len(text.strip()) < 10:
                raise HTTPException(status_code=400, detail="Could not extract text from PDF")

            notes = create_study_notes(text)

            # JSON formatını temizle
            if notes.startswith('```json'):
                notes = notes.replace('```json', '').replace('```', '').strip()
            elif notes.startswith('```'):
                notes = notes.replace('```', '').strip()

            return notes

        finally:
            # Geçici dosyayı temizle
            if os.path.exists(temp_path):
                os.remove(temp_path)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating study notes: {str(e)}")


@app.get("/")
async def root():
    return {"message": "AI Study Assistant API", "version": "1.0.0",
            "endpoints": ["/upload-pdf", "/study-notes-from-pdf"]}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": ["summary", "study_notes"]}
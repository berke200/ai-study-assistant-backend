🚀 AI Study Assistant

Transform academic PDFs into clean summaries & structured study notes.

AI Study Assistant is a lightweight web application that helps students extract key information from PDF materials.
Just upload your document — the system generates:

✅ Clean, readable summaries
✅ Structured, collapsible study notes (perfect for exam preparation)

Built with FastAPI, Gemini AI, and a minimal vanilla JS frontend.

✨ Features
📘 PDF → Summary

Quick, well-structured summaries generated from your uploaded PDF.

🗂️ PDF → Study Notes

Automatically restructures lecture PDFs into:

High-level sections

Collapsible topics

Clean, readable formatting

Exam-friendly breakdowns

⚡ Smooth UX

iPhone-style skeleton loaders

Dark, modern UI

Fast response time

Fully local backend

🧰 Tech Stack

Backend

FastAPI

Python

PyPDF2

Google Gemini (Generative AI)

python-dotenv

Frontend

HTML / CSS

Vanilla JavaScript

Markdown rendering via marked.js

📦 Installation
1. Clone the repo
git clone https://github.com/yourusername/AI-Study-Assistant.git
cd AI-Study-Assistant

2. Install dependencies
pip install -r requirements.txt

3. Create .env
GEMINI_API_KEY=your_key_here

4. Run backend
uvicorn main:app --reload --port 8000

5. Run frontend (VSCode Live Server or any static server)
index.html

📁 Project Structure
project/
│── main.py
│── pdf_reader.py
│── summarizer.py
│── chunker.py
│── .env
│── requirements.txt
│
└── frontend/
    ├── index.html
    ├── app.js
    └── style.css

🧪 Example Output

Study Notes (Auto-Generated):

Collapsible sections

Key concepts extracted

Clean formatting

Suitable for last-minute revision

Summary Output:

Bullet-point breakdown

Supports long PDFs

Easy to read and export

🎯 Purpose

Designed for students who want to:

Study smarter, not harder

Convert messy lecture PDFs into structured material

Prepare efficiently for exams

Save time on note-taking

🤝 Contributions

PRs, ideas, and improvements are welcome.

LICENSE:
MIT LICENSE
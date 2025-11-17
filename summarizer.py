import google.generativeai as genai
from dotenv import load_dotenv
import os
import time
from chunker import chunk_text

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")

def safe_generate(prompt):
    for _ in range(8):
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print("Retry:", e)
            time.sleep(1)

    return "Model overload."


def summarize_pdf(text):
    chunks = chunk_text(text, max_len=3500)
    partial = []

    for c in chunks:
        summary = safe_generate(
            f"Summarize this clearly and simply:\n{c}"
        )
        partial.append(summary)

    combined = "\n".join(partial)

    final = safe_generate(
        f"Combine these summaries into one final summary:\n{combined}"
    )

    return final


def create_study_notes(text):
    prompt = (
        "Convert this into clean study notes:\n"
        "- Use headings (###)\n"
        "- Use bullet points\n"
        "- Make it simple and clear\n"
        f"\n{text}"
    )

    return safe_generate(prompt)

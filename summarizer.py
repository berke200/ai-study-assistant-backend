from google import genai
from dotenv import load_dotenv
import os
import time
from chunker import chunk_text

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def safe_generate(prompt):
    for _ in range(4):
        try:
            r = client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt
            )
            return r.text
        except Exception:
            time.sleep(0.2)
    return "Model overload."

def summarize_pdf(text):
    chunks = chunk_text(text, max_len=7000)
    partial = []

    for c in chunks:
        summary = safe_generate(
            f"Simplify this text for a student:\n{c}"
        )
        partial.append(summary)

    combined = "\n".join(partial)

    final = safe_generate(
        "Merge these summaries into one clear readable summary:\n" + combined
    )

    return final


def create_study_notes(text):
    prompt = (
        "Convert this into CLEAN STUDY NOTES.\n"
        "- Use markdown (### headings, bullet points)\n"
        "- Add spacing between topics\n"
        "- No long paragraphs\n"
        "- Make it readable and organized\n"
        f"\nContent:\n{text}"
    )
    return safe_generate(prompt)

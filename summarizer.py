import os
import time
from dotenv import load_dotenv
import google.generativeai as genai
from chunker import chunk_text

load_dotenv()

# Sadece konfigürasyon yapıyoruz, client dönmez
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Tek bir model objesi kullan
MODEL_NAME = "gemini-1.5-flash"  # Render'da kesin çalışan isim
_model = genai.GenerativeModel(MODEL_NAME)


def safe_generate(prompt: str) -> str:
    """
    Google Generative AI çağrısını birkaç kere deneyen basit helper.
    """
    for _ in range(4):
        try:
            resp = _model.generate_content(prompt)
            # google.generativeai 0.8.5 için:
            return resp.text
        except Exception:
            time.sleep(0.2)

    return "Model overload."


def summarize_pdf(text: str) -> str:
    """
    PDF metnini önce parçalara bölüp her parçayı özetler,
    sonra bu özetleri tek bir düzgün özet haline getirir.
    """
    chunks = chunk_text(text, max_len=7000)
    partial_summaries = []

    for c in chunks:
        summary = safe_generate(
            f"Simplify this text for a student. Keep it clear and concise:\n\n{c}"
        )
        partial_summaries.append(summary)

    combined = "\n\n".join(partial_summaries)

    final = safe_generate(
        "Merge these partial summaries into one clear, readable summary:\n\n" + combined
    )

    return final


def create_study_notes(text: str) -> str:
    """
    Metni markdown formatında çalışması kolay notlara çevirir.
    """
    prompt = (
        "Convert this into CLEAN, WELL-STRUCTURED STUDY NOTES.\n"
        "- Use Markdown (### headings, bullet points, sub-bullets)\n"
        "- Add spacing between topics\n"
        "- Avoid huge paragraphs, keep it exam-friendly\n"
        "- Do NOT wrap the output in ``` blocks\n"
        "\nContent:\n"
        f"{text}"
    )
    return safe_generate(prompt)

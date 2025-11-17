from PyPDF2 import PdfReader

def extract_text_from_pdf(path):
    output_text = ""
    reader = PdfReader(path)

    for page in reader.pages:
        text = page.extract_text()
        if text:
            output_text += text + "\n"

    return output_text

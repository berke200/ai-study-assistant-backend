def chunk_text(text, max_len=8000):
    chunks = []
    for x in range(0, len(text), max_len):
        chunk = text[x:x+max_len]
        chunks.append(chunk)
    return chunks

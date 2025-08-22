import os
from pathlib import Path
from PyPDF2 import PdfReader
from openai import OpenAI  # ✅ nuevo import

# Inicializar cliente con la API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def extract_text_from_pdf(path: str) -> str:
    """Extrae texto de un PDF usando PyPDF2"""
    reader = PdfReader(path)
    text = ""
    for page in reader.pages[:5]:  # solo primeras 5 páginas
        text += page.extract_text() or ""
    return text.strip()


def get_file_content(path: str) -> str:
    """Lee contenido de un archivo (PDF, txt, md)"""
    ext = Path(path).suffix.lower()
    if ext == ".pdf":
        return extract_text_from_pdf(path)
    elif ext in [".txt", ".md"]:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    return ""


def generate_summary(content: str) -> str:
    """Genera un resumen con OpenAI GPT (API nueva >=1.0.0)"""
    if not content.strip():
        return "Documento sin contenido legible"

    summary_prompt = f"Resume este documento en 5 líneas:\n\n{content[:3000]}"

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # ✅ puedes cambiar a gpt-4o-mini si prefieres
            messages=[
                {"role": "system", "content": "Eres un asistente que resume documentos."},
                {"role": "user", "content": summary_prompt}
            ],
            max_tokens=150,
            temperature=0.5,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"❌ Error generando resumen: {e}")
        return "Error generando resumen"

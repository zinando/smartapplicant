import docx2txt
import PyPDF2
import io
from .tasks import mock_heavy_parsing

def extract_text(file_bytes, filename):
    """Extract text from PDF/DOCX in memory"""
    try:
        if filename.endswith('.pdf'):
            with io.BytesIO(file_bytes) as pdf_buffer:
                reader = PyPDF2.PdfReader(pdf_buffer)
                text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
        elif filename.endswith('.docx'):
            with io.BytesIO(file_bytes) as docx_buffer:
                text = docx2txt.process(docx_buffer)
        else:
            raise Exception("Unsupported file type (only PDF/DOCX)")
        return {'status': 1, 'text': text, 'message': 'success'}
    except Exception as e:
        return {'status': 0, 'message': str(e)}

def calculate_ats_score(text):
    """Placeholder: Implement your ATS scoring logic"""
    required_sections = ['experience', 'education', 'skills']
    score = sum(1 for section in required_sections if section in text.lower()) / len(required_sections)
    return round(score * 100, 2)
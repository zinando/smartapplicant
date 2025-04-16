import spacy
import docx2txt
import PyPDF2
import io
import re
import mimetypes

# Load NLP model
nlp = spacy.load("en_core_web_md")

def convert_words_to_numbers(text):
    number_words = {
        "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
        "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
        "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14,
        "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18,
        "nineteen": 19, "twenty": 20, "thirty": 30, "forty": 40,
    }
    for word, num in number_words.items():
        text = re.sub(rf"\b{word}\b", str(num), text, flags=re.IGNORECASE)
    return text

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

def calculate_ats_score(data):
    """Calculate ATS score based on number of required sections that has values in data"""
    required_sections = ['experience', 'education', 'skills', 'certifications', 'name', 'email', 'phone']
    filled_sections = [section for section in required_sections if data.get(section)]
    total_sections = len(required_sections)
    filled_sections_count = len(filled_sections)
    ats_score = (filled_sections_count / total_sections) * 100
    return round(ats_score, 2)

def extract_experience_with_nlp(text):
    doc = nlp(text)
    for sent in doc.sents:
        if "experience" in sent.text.lower():
            sentence_text = convert_words_to_numbers(sent.text.lower())
            match = re.search(r"(\d+)\+?\s*(years|yrs)", sentence_text)
            if match:
                return match.group(0)
    return None

def extract_email(text):
    """Extract email using regex."""
    match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    return match.group(0) if match else None

def extract_phone(text):
    """Extract phone number using regex (supports multiple formats)."""
    match = re.search(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
    return match.group(0) if match else None

def extract_skills(text):
    """Extract skills using a predefined list."""
    skills = ["Python", "Django", "SQL", "Java", "JavaScript", "Machine Learning", "Data Analysis"]
    found_skills = [skill for skill in skills if skill.lower() in text.lower()]
    return found_skills if found_skills else None

def extract_name(text):
    """Extract name from the resume text"""
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return None

def extract_educationxx(text):
    """Extract education using regex."""
    edu_match = re.search(r"(bachelor|master|b\.sc|m\.sc|ph\.d|diploma).{0,50}?(university|college)?", text, re.IGNORECASE)
    return edu_match.group(0).strip() if edu_match else None

def extract_education(text):
    """
    Extract structured education information from resume text
    Returns: List of dicts with {degree, institution, duration} or None
    """
    def format_duration(duration_str):
        """Standardize duration formatting (nested helper function)"""
        if not duration_str:
            return None
            
        # Clean up separators
        duration_str = re.sub(r'\s*to\s*', ' - ', duration_str, flags=re.IGNORECASE)
        duration_str = re.sub(r'\s*–\s*', ' - ', duration_str)  # Replace en dash
        duration_str = re.sub(r'\s*-\s*', ' - ', duration_str)  # Standardize hyphens
        
        # Format present/current
        duration_str = re.sub(r'(?i)\bpresent\b', 'Present', duration_str)
        
        return duration_str.strip()

    # Improved regex pattern to capture degree, institution, and years
    pattern = r"""
        (?P<degree>bachelor|master|b\.?sc|m\.?sc|ph\.?d|diploma|associate|phd)[\s\.,]*
        (?:degree|in)?[\s\.,]*
        (?:(?:in|of)[\s\.,]*(?P<field>\w[\w\s]*?))?[\s\.,]*
        (?:from|at)?[\s\.,]*
        (?P<institution>[A-Z][\w\s-]+?(?:university|college|institute|school)|[A-Z]{2,})[\s\.,]*
        (?P<duration>(?:\d{4}(?:\s|–|-)*(?:to|present|\d{4})|\w+\s\d{4}\s*(?:–|-)\s*(?:\w+\s\d{4}|present)))
    """
    
    matches = re.finditer(pattern, text, re.IGNORECASE | re.VERBOSE)
    education_entries = []
    
    for match in matches:
        entry = {
            'degree': (match.group('degree') or '').title(),
            'field': (match.group('field') or '').title(),
            'institution': (match.group('institution') or '').title(),
            'duration': format_duration(match.group('duration')) if match.group('duration') else None
        }
        education_entries.append(entry)
    # print(f"Education entries: {education_entries}")
    return education_entries if education_entries else None

def extract_certificates(text):
    """
    Extract structured certification information from resume text
    Returns: List of dicts with {name, issuer, date} or None
    """
    def infer_issuer(cert_name):
        """Infer issuer based on certification name"""
        issuer_map = {
            'PMP': 'Project Management Institute',
            'AWS': 'Amazon Web Services',
            'Microsoft': 'Microsoft',
            'Cisco': 'Cisco Systems',
            'CompTIA': 'CompTIA',
            'Google': 'Google Cloud',
            'Oracle': 'Oracle Corporation'
        }
        for key in issuer_map:
            if key in cert_name:
                return issuer_map[key]
        return ''

    def extract_cert_date(context_text, cert_name):
        """Extract approximate certification date"""
        # Fixed pattern without invalid character range
        date_pattern = r"(?:{})(?:\s|\w|,|\.|-){{0,20}}(20\d{{2}}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{{4}})".format(re.escape(cert_name))
        date_match = re.search(date_pattern, context_text, re.IGNORECASE)
        return date_match.group(1) if date_match else None

    patterns = [
        # PMP Certification
        r"(?P<name>PMP)\s?(?:certified|certification)?\s?(?:by)?\s?(?P<issuer>Project Management Institute)?",
        # AWS Certifications
        r"(?P<name>AWS Certified [\w-]+)\s?(?:by)?\s?(?P<issuer>Amazon Web Services)?",
        # Microsoft Certifications
        r"(?P<name>Microsoft Certified:? [\w-]+)\s?(?:by)?\s?(?P<issuer>Microsoft)?",
        # General certification pattern
        r"(?P<name>(?:[A-Z][\w]+ ){1,3}(?:Certified|Professional|Specialist|Expert))\s?(?:by)?\s?(?P<issuer>[\w\s]+?)(?=\s|,|$)",
        # Short form certs (CISSP, CCNA, etc)
        r"""
            (?P<name>\b(?:PMP|AWS|CCNA|CISSP|CPA|CFA|CEH|CISM|ITIL|AWS|GCP)\b)
            \s?(?:certified|certification)?\s?
            (?:by)?\s?
            (?P<issuer>(?:\w+\s){0,4}\w+)?
            (?=\s|,|\.|$)
        """
    ]

    certificates = []
    for pattern in patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            cert = {
                'name': (match.group('name') or '').strip(),
                'issuer': (match.group('issuer') or infer_issuer(match.group('name'))).strip(),
                'date': extract_cert_date(text, match.group('name'))
            }
            if cert['name'] and cert not in certificates:
                certificates.append(cert)
        
    return certificates if certificates else None

def parse_resume(text):
    """Extract structured data from a resume file (PDF or DOCX)."""
    # text = extract_text_from_file(file_obj)

    # print(f'education: {extract_education(text)}')

    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "experience": extract_experience_with_nlp(text),
        "education": extract_education(text),
        "certificates": extract_certificates(text)
    }

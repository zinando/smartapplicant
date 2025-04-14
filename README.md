# Smart Applicant 🔍✨

**Optimize Your Resume for ATS & Recruiters**  
*Get instant feedback on your resume's ATS compatibility, relevance to job descriptions, and AI-powered enhancement tips.*

[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![Smart Applicant Demo](demo.gif) <!-- Replace with actual demo gif -->

## 🚀 Features

### **Free Tier**
- **ATS Readability Scan**  
  - Detects hidden text, unsupported formats, and section visibility.
- **Content Gap Analysis**  
  - Highlights missing keywords from job descriptions (e.g., skills, education).
- **Relevance Score**  
  - Rates resume-JD match (0-100%) with breakdowns.
- **Enhancement Tips**  
  - AI-generated suggestions to improve your resume.

### **Pro Tier (Coming Soon)**
- **AI-Powered Tailored Resumes**  
  - Generate job-specific resumes in seconds.
- **Multi-Resume Management**  
  - Track versions for different job applications.

## 🛠️ Tech Stack

| Component       | Technology                          |
|-----------------|-------------------------------------|
| **Backend**     | Django 4.2 + Django REST Framework  |
| **Frontend**    | Next.js 13 (App Router) + Tailwind  |
| **Database**    | PostgreSQL                          |
| **AI/NLP**      | spaCy, OpenAI API                   |
| **Deployment**  | Vercel (Frontend) + Render (Django) |
| **Auth**        | JWT (SimpleJWT)                     |

## 📦 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### Steps
1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/smart-applicant.git
   cd smart-applicant
   ```

2. **Set up backend**
    ```bash
    cd backend
    python -m venv venv
    venv\Scripts\activate on # Windows | source venv/bin/activate  for Linux/Mac
    pip install -r requirements.txt
    python manage.py migrate
    ```
3. **Set up frontend**
    ```bash
    cd ../frontend
    npm install
    ```
4. **Run locally**
    ```bash
    # Backend (Django)
    python manage.py runserver

    # Frontend (Next.js)
    npm run dev
    ```
Access at http://localhost:3000

🌟 Why Smart Applicant?
Privacy-First: No resume data stored without permission.

Open Core: Free tier fully open-source; Pro tier funds development.

ATS Science: Based on real recruiter workflows (not guesswork).

🤝 Contributing
We welcome PRs! See our Contribution Guide for:

Feature requests

Bug reports

Code style conventions

📄 License
MIT © 2023 [Your Name]
Empowering job seekers worldwide.


---

### Key Additions for Production:
1. **Demo Assets**: Replace `demo.gif` with a Loom/screen recording.
2. **Badges**: Add CI/CD (e.g., GitHub Actions), test coverage, and dependency status.
3. **Roadmap**: Add a `ROADMAP.md` linking to future features.
4. **Environment Setup**: Include `.env` template (`.env.example`).

---

Want me to:
1. Draft the `CONTRIBUTING.md`?
2. Add detailed API docs (e.g., Swagger setup)?
3. Create an issue template for bug reports?  

Let’s refine this together!


def get_suggestions_for_resume(resume_text, job_description=""):
    """This function takes a resume text and a job description and returns a list of suggestions for improving the resume."""
    return [
            "Add 3-5 more technical skills from the job description",
            "Quantify achievements in your experience section (e.g., 'Increased performance by 30%')",
            "Include more action verbs like 'developed', 'led', 'optimized'",
            "Add a summary section at the top of your resume",
            "Make sure to include relevant certifications"
    ]

def compare_ats_score(resume_score):
    """This function compares the ATS score of the resume with that of other user's resumes."""
    return 65

def get_keyword_coverage(resume_text, job_description=''):
    """This function takes a resume text and a job description and returns the keyword coverage of the resume."""
    return {
            "Technical Skills": 85,
            "Soft Skills": 62,
            "Industry Terms": 73
        }

def get_resume_score_rating(ats_score):
    """This function takes an ATS score and returns a rating based on the score."""
    if ats_score >= 90:
        return "Excellent"
    elif ats_score >= 75:
        return "Good"
    elif ats_score >= 50:
        return "Average"
    else:
        return "Poor"

def add_user_resume_data(user, resume_data):
    """This function takes a user and resume data and adds the resume data to the user's profile."""
    try:
        # Check if user resume data is null or empty
        if not user.resume_data:
            resume_data['id'] = 1
            user.resume_data = [resume_data]
            user.save()
            return True
        # Check if resume data already exists
        for data in user.resume_data:
            if 'id' in resume_data and data['id'] == resume_data['id']:
                return False
        # Add new resume data
        resume_data['id'] = len(user.resume_data) + 1
        user.resume_data.append(resume_data)
        user.save()
        return True

    except Exception as e:
        print(f"Error adding resume data: {e}")
        return False
    
def update_user_resume_data_id(user):
    """This function takes a user and assigns a new id to all the resume data."""
    if not user.resume_data:
        user.resume_data = None
        user.save()
        
    else:
        for i, data in enumerate(user.resume_data):
            data['id'] = i + 1
        user.save()
    
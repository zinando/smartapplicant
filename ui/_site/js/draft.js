const personalInfo = ['first-name', 'last-name', 'other-name', 'email', 'linkedin', 'portfolio', 'git', 'phone', 'city', 'state', 'country'];

// On page load
document.addEventListener('DOMContentLoaded', async () => {
  const draft = await getDraft();
  const draftBtn = document.getElementById('draft-action-btn');
  
  if (draft) {
    draftBtn.textContent = 'Load Draft';
    draftBtn.onclick = () => loadDraft(draft);
  } else {
    draftBtn.textContent = 'Save Draft';
    draftBtn.onclick = saveDraft;
  }


    // On next button clicks (all steps)
    document.querySelectorAll('[onclick^="nextStep"]').forEach(btn => {
    const originalOnclick = btn.onclick;
    btn.onclick = async function() {
        await saveDraft();
        originalOnclick.call(this);
    };
    });
});

// Format date for month inputs (YYYY-MM)
function formatDate(dateString) {
  // Handle both Date objects and string inputs
  const date = new Date(dateString);
  if (isNaN(date)) return ''; // Return empty string for invalid dates
  
  // Format as YYYY-MM for month inputs
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// Get partial form data (only filled fields)
function getPartialFormData() {
  const data = {};
  const form = document.getElementById('resume-form');
  
  // Personal info
  personalInfo.forEach(id => {
    const value = document.getElementById(id)?.value.trim();
    if (value) data[id] = value;
  });
  
  // Education
  const education = [];
  document.querySelectorAll('.education-item').forEach(item => {
    const entry = {};
    ['degree', 'institution', 'field', 'graduation'].forEach(field => {
      const value = item.querySelector(`[name="${field}"]`)?.value.trim();
      if (value) entry[field] = value;
    });
    if (Object.keys(entry).length > 0) education.push(entry);
  });
  if (education.length > 0) data.education = education;

  // Experience
    const experience = [];
    document.querySelectorAll('.experience-item').forEach(item => {
        const entry = {};
        ['job-title', 'company', 'start-date', 'end-date'].forEach(field => {
        const value = item.querySelector(`[name="${field}"]`)?.value.trim();
        if (value) entry[field] = value;
        });
        // Check if current-job checkbox is checked
        const currentJobCheckbox = item.querySelector('[name="current-job"]');
        if (currentJobCheckbox) {
            entry['current-job'] = currentJobCheckbox.checked;
        }
        // Add all responsibility fileds if they exist
        const responsibilities = [];
        item.querySelectorAll('[name="responsibility"]').forEach(responsibility => {
            const value = responsibility.value.trim();
            if (value) responsibilities.push(value);
        });
        
        // Aggregate responsibilities if any and other fields
        if (responsibilities.length > 0) {
            entry.responsibilities = responsibilities;
        }
        if (Object.keys(entry).length > 0) experience.push(entry);
    
    });
    if (experience.length > 0) data.experience = experience;

    // Certifications
    const certifications = [];
    document.querySelectorAll('.certification-item').forEach(item => {
        const entry = {};
        ['cert-name', 'cert-org', 'cert-date', 'cert-expiry'].forEach(field => {
            const value = item.querySelector(`[name="${field}"]`)?.value.trim();
            if (value) entry[field] = value;
        });
        // Check if no-expiry checkbox is checked
        const noExpiryCheckbox = item.querySelector('[name="no-expiry"]');
        if (noExpiryCheckbox) {
            entry['no-expiry'] = noExpiryCheckbox.checked;
        }
        if (Object.keys(entry).length > 0) certifications.push(entry);
    });
    if (certifications.length > 0) data.certifications = certifications;

    // Skills
    // Get all skills from the input field and split by commas
    const skillsInput = document.getElementById('skills');
    if (skillsInput) {
        const skillsValue = skillsInput.value.trim();
        if (skillsValue) {
            data.skills = skillsValue.split(',').map(skill => skill.trim()).filter(skill => skill);
        }
    }

    // Template
    const templateRadios = document.querySelectorAll('input[name="template"]');
    const selectedTemplate = Array.from(templateRadios).find(radio => radio.checked)?.value;
    if (selectedTemplate) {
        data.template = selectedTemplate;
    }

    // Last updated timestamp
    data.last_updated = new Date().toISOString();
  
  return data;
}

// Populate form selectively
function populateFormSelectively(draft) {
  // Personal info
  Object.entries(draft).forEach(([key, value]) => {
    if (personalInfo.includes(key)) {
      const field = document.getElementById(key);
      if (field && !field.value) {
            field.value = value;
        }
    }
  });
  
  // Education
    populateEducation(draft);

    // Experience
    populateExperience(draft);

    // Certifications
    populateCertifications(draft);

    // Skills
    populateSkills(draft);
}

function populateEducation(draft) {
  if (!draft.education) return;

  const container = document.getElementById('education-container');
  const existingItems = container.querySelectorAll('.education-item');
  
  // Process each education entry
  draft.education.forEach((edu, index) => {
    let item = existingItems[index];
    
    // Add new item if doesn't exist
    if (!item && index > 0) {
      addEducation();
      item = container.querySelectorAll('.education-item')[index];
    }
    if (!item) return;

    // Populate only empty fields
    ['degree', 'institution', 'field', 'graduation'].forEach(field => {
      const input = item.querySelector(`[name="${field}"]`);
      if (input && !input.value && edu[field]) {
        input.value = field === 'graduation' 
          ? formatGraduationDate(edu[field]) 
          : edu[field];
      }
    });
  });

  // Remove empty items beyond draft data
  Array.from(existingItems).slice(draft.education.length).forEach(item => {
    if (isEmptyEducationItem(item)) item.remove();
  });
}

function populateExperience(draft) {
  if (!draft.experience) return;

  const container = document.getElementById('experience-container');
  const existingItems = container.querySelectorAll('.experience-item');
  
  // Process each experience entry
  draft.experience.forEach((exp, index) => {
    let item = existingItems[index];
    
    // Add new item if doesn't exist
    if (!item && index > 0) {
      addExperience();
      item = container.querySelectorAll('.experience-item')[index];
    }
    if (!item) return;

    // Populate main fields only if empty
    ['job-title', 'company', 'start-date', 'end-date'].forEach(field => {
      const input = item.querySelector(`[name="${field}"]`);
      if (input && !input.value && exp[field]) {
        input.value = field.endsWith('-date') 
          ? formatDate(exp[field]) 
          : exp[field];
      }
    });

    // Handle current job checkbox
    if (exp.current) {
      const checkbox = item.querySelector('[name="current-job"]');
      if (checkbox) checkbox.checked = true;
    }

    // Populate responsibilities
    if (exp.responsibilities) {
      const responsibilitiesContainer = item.querySelector('.responsibilities-container');
      exp.responsibilities.forEach((resp, respIndex) => {
        if (respIndex > 0) addResponsibility(item);
        const inputs = responsibilitiesContainer.querySelectorAll('[name="responsibility"]');
        if (inputs[respIndex] && !inputs[respIndex].value) {
          inputs[respIndex].value = resp;
        }
      });
    }
  });

  // Remove empty items beyond draft data
  Array.from(existingItems).slice(draft.experience.length).forEach(item => {
    if (isEmptyExperienceItem(item)) item.remove();
  });
}

function populateCertifications(draft) {
  if (!draft.certifications) return;

  const container = document.getElementById('certification-container');
  const existingItems = container.querySelectorAll('.certification-item');
  
  // Process each certification entry
  draft.certifications.forEach((cert, index) => {
    let item = existingItems[index];
    
    // Add new item if doesn't exist
    if (!item && index > 0) {
      addCertification();
      item = container.querySelectorAll('.certification-item')[index];
    }
    if (!item) return;

    // Populate main fields only if empty
    ['cert-name', 'cert-org', 'cert-date', 'cert-expiry'].forEach(field => {
      const input = item.querySelector(`[name="${field}"]`);
      if (input && !input.value && cert[field]) {
        input.value = field.endsWith('-date') || field === 'cert-expiry'
          ? formatDate(cert[field])
          : cert[field];
      }
    });

    // Handle no-expiry checkbox
    if (cert.noExpiry) {
      const checkbox = item.querySelector('[name="no-expiry"]');
      if (checkbox) checkbox.checked = true;
    }
  });

  // Remove empty items beyond draft data
  Array.from(existingItems).slice(draft.certifications.length).forEach(item => {
    if (isEmptyCertificationItem(item)) item.remove();
  });
}

function populateSkills(draft) {
  if (!draft.skills) return;
  
  const skillsTextarea = document.getElementById('skills');
  if (skillsTextarea && !skillsTextarea.value) {
    // Format skills as comma-separated list if array, otherwise use as-is
    const skillsValue = Array.isArray(draft.skills) 
      ? draft.skills.join(', ')
      : draft.skills;
      
    skillsTextarea.value = skillsValue;
  }
}

function isEmptyCertificationItem(item) {
  return ['cert-name', 'cert-org'].every(field => 
    !item.querySelector(`[name="${field}"]`).value
  );
}

function isEmptyExperienceItem(item) {
  const mainFieldsEmpty = ['job-title', 'company'].every(field => 
    !item.querySelector(`[name="${field}"]`).value
  );
  const responsibilitiesEmpty = item.querySelectorAll('[name="responsibility"]').length === 0;
  return mainFieldsEmpty && responsibilitiesEmpty;
}

function formatGraduationDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function isEmptyEducationItem(item) {
  return ['degree', 'institution', 'field', 'graduation'].every(field => 
    !item.querySelector(`[name="${field}"]`).value
  );
}

// Toggle draft button state
function toggleDraftButton(state) {
  const btn = document.getElementById('draft-action-btn');
  if (state === 'loaded') {
    btn.textContent = 'Load Draft';
    btn.onclick = loadDraft;
  } else {
    btn.textContent = 'Save Draft';
    btn.onclick = saveDraft;
  }
}

// Save draft (auto-triggered on next button clicks)
async function saveDraft() {
  const draftSpinner = document.getElementById('draft-spinner');
  // delay to prevent multiple rapid saves
  draftSpinner.classList.remove('hidden');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  
  // Get current form data (partial)
  const currentData = getPartialFormData();
  
  // Get existing draft
  const existingDraft = await getDraft() || {};
  
  // Merge data (new fields override old ones)
  const mergedDraft = {...existingDraft, ...currentData};
  
  try {
        // Save to backend
        API.request('/api/auth/resumes/draft/', 'POST', mergedDraft);
        
        // Save to localStorage
        const user = API.getUser();
        const existingDraft = user.resume_draft || {};

        if (Object.keys(mergedDraft).length > 0) {
            API.setUser({
                ...user,
                resume_draft: {
                ...existingDraft,
                ...mergedDraft
                }
            });
        }
        
        // Update UI
        toggleDraftButton('loaded');
  } catch (error) {
        console.error('Draft save failed:', error);
        // Fallback: save to localStorage only
        const user = API.getUser();
        const existingDraft = user.resume_draft || {};
        if (Object.keys(mergedDraft).length > 0) {
            API.setUser({
                ...user,
                resume_draft: {
                    ...existingDraft,
                    ...mergedDraft
                }
            });
        }
        showToast(`Draft saved locally. Failed to save at backend: ${error.message}`, 'error');
  } finally {
        draftSpinner.classList.add('hidden');
  }
}

// Get draft data
async function getDraft() {
    userData = API.getUser();
  // Try backend first
  try {
    const response = await API.request('/api/auth/resumes/draft/');
    if (!response.ok) {
      throw new Error('Failed to fetch draft from backend');
    }
    data = await response.json();
    if (data.status !== 1) {
      throw new Error(data.message || 'Draft not found');
    }
    // Update user data
    API.setUser(data.user);
    return data.user.resume_draft || null;
  } catch (error) {
    console.error('Failed to fetch draft:', error.message);
  }
  
  // Fallback to localStorage
  const localDraft = userData ? userData.resume_draft : sampleDraftData;
  return localDraft;
}

// Load draft into form
function loadDraft(draft=null) {
  if (!draft) return;
  
  // Partial form population (only filled fields)
  populateFormSelectively(draft);

    // Step 1 fields validation: toggle next button state
    const step1Fields = ['first-name', 'last-name', 'email', 'phone', 'city', 'state', 'country'];
    const allFilled = step1Fields.every(id => {
        const value = document.getElementById(id)?.value.trim();
        return value !== '';
    });
    setButtonState('step-1-content-button', !allFilled, 'bg-blue-600');

    // Step 2 fields validation (education): toggle next button state
    const fields = document.querySelectorAll('#education-container input[name="degree"], #education-container input[name="institution"], #education-container input[name="field"], #education-container input[name="graduation"]');
    const allFilled2 = Array.from(fields).every(field => field.value.trim() !== '');
    setButtonState('step-2-content-button', !allFilled2, 'bg-blue-600');

  
  // Update UI state
  toggleDraftButton('saved');
}


const sampleDraftData = {
  
    'first-name': "John",
    'last-name': "Doe",
    'other-name': "Michael",
    email: "john.doe@example.com",
    phone: "+1234567890",
    linkedin: "john-doe-profile",
    portfolio: "https://johndoe.dev",
    git: "https://github.com/johndoe",
    city: "San Francisco",
    state: "California",
    country: "United States",
  education: [
    {
      "degree": "Master of Science",
      "institution": "Stanford University",
      "field": "Computer Science",
      "graduation": "2020-06"
    },
    {
      "degree": "Bachelor of Engineering",
      "institution": "MIT",
      "field": "Electrical Engineering",
      "graduation": "2018-05"
    }
  ],
  experience: [
    {
      "job-title": "Senior Software Engineer",
      "company": "Tech Corp Inc.",
      "start-date": "2020-07",
      "end-date": "",
      "current": true,
      "responsibilities": [
        "Led development of core product features",
        "Mentored junior engineers",
        "Optimized application performance by 40%"
      ]
    },
    {
      "job-title": "Software Engineer Intern",
      "company": "Innovate Labs",
      "start-date": "2019-06",
      "end-date": "2019-08",
      "current": false,
      "responsibilities": [
        "Developed prototype applications",
        "Participated in code reviews"
      ]
    }
  ],
  certifications: [
    {
      "cert-name": "AWS Certified Solutions Architect",
      "cert-org": "Amazon Web Services",
      "cert-date": "2021-03",
      "cert-expiry": "2024-03",
      "no-expiry": false
    },
    {
      "cert-name": "Google Cloud Professional",
      "cert-org": "Google Cloud",
      "cert-date": "2022-05",
      "cert-expiry": null,
      "no-expiry": true
    }
  ],
  skills: [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "Project Management",
    "UI/UX Design"
  ],
  
  "last_updated": "2023-11-15T14:30:00Z",
  template: "professional"

};

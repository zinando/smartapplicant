/**
 * @fileoverview This file contains the JavaScript code for handling input suggestions.
 * It provides functionality to display and manage suggestions for user inputs.
 */

// ---- Input Suggestions Functionality For Create New resume form----//

// 1. Load all available Job Titles, Responsibilities and Skills from Backend
const resumeInputSuggestions = {};
const resumeSkillSuggestions = {};

document.addEventListener('DOMContentLoaded', () => {
  loadCommonData();
});

function loadCommonData() {
  API.request("/api/user/resume/input-suggestions/")
    .then(
        // check if response is ok (status code 200-299)
        response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        }
    )
    .then(data => {
      if (data.status === 1) {
        // update the resumeInpuSuggestions object with new data
        Object.assign(resumeInputSuggestions, data.resume_input_suggestions);
        Object.assign(resumeSkillSuggestions, data.resume_skill_suggestions);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

// function to create suggestions for a new job title input in the backend
async function createNewJobTitleSuggestion(inputValue) {
    if (inputValue && !Object.keys(resumeInputSuggestions).map(item => item.toLowerCase()).includes(inputValue.toLowerCase())) {
        // console.log('Creating new job title suggestion:', inputValue);
        // Call backend to create new job title suggestion
        API.request(`/api/user/resume/input-suggestions/?new_job_title=${encodeURIComponent(inputValue.trim())}`, 'PUT')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 1) {
                    const taskId = data.task_id;
                    pollTaskResult(taskId)
                    .then(result => {
                        Object.assign(resumeInputSuggestions, result.responsibilities);
                        Object.assign(resumeSkillSuggestions, result.skills);
                    })
                    .catch(error => {
                        console.error('Error polling task result:', error);
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    } 
  return resumeInputSuggestions;
}

// function to create new skill sugestion
async function createNewSkillSuggestion(jobTitle, skillInput) {
  if (skillInput && jobTitle && !Object.keys(resumeSkillSuggestions).map(item => item.toLowerCase()).includes(skillInput.toLowerCase())){
    API.request(`/api/user/resume/input-suggestions/?job_title=${encodeURIComponent(jobTitle.trim())}&new_skill=${encodeURIComponent(skillInput.trim())}`, 'PUT')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 1) {
                    const taskId = data.task_id;
                    pollTaskResult(taskId)
                    .then(result => {
                        Object.assign(resumeInputSuggestions, result.responsibilities);
                        Object.assign(resumeSkillSuggestions, result.skills);
                    })
                    .catch(error => {
                        console.error('Error polling task result:', error);
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
  }
}
// 2. Input suggestions for job title

function showJobTitleSuggestions(inputElement, container=null) {
  const inputValue = inputElement.value.toLowerCase();
  const suggestionsContainer = container || document.getElementById('job-title-suggestions');

  const commonJobTitles = Object.keys(resumeInputSuggestions)
    .filter(title => title.toLowerCase().includes(inputValue))
    .map(title =>
        title
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  
  // Clear previous suggestions
  suggestionsContainer.innerHTML = '';
    
  // Show suggestions if there are matches
  if (inputValue && commonJobTitles.length > 0) {
    commonJobTitles.forEach(title => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = title;
      div.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent losing focus on inp
        inputElement.value = title;
        suggestionsContainer.classList.add('hidden');
        
        // // Auto-populate responsibilities if available
        // populateResponsibilities(title);
      });
      suggestionsContainer.appendChild(div);
    });
    
    // Position and show suggestions container
    document.body.appendChild(suggestionsContainer); // Ensure it's in the DOM
    const rect = inputElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    suggestionsContainer.style.position = "absolute";
    suggestionsContainer.style.top = `${rect.bottom + scrollTop}px`;
    suggestionsContainer.style.left = `${rect.left}px`;
    suggestionsContainer.style.width = `${rect.width}px`;
    suggestionsContainer.classList.remove('hidden');
  } else {
    suggestionsContainer.classList.add('hidden');
  }
}

// Function to populate responsibilities based on job title
function populateResponsibilities(jobTitle) {
  const responsibilities = jobSuggestions[jobTitle.toLowerCase()];
  if (responsibilities) {
    const responsibilityContainer = document.querySelector('.experience-item:last-child .responsibilities-container');
    responsibilityContainer.innerHTML = ''; // Clear existing responsibilities
    
    responsibilities.forEach(resp => {
      addResponsibilityWithText(resp);
    });
  }
}

// Modified addResponsibility function to accept text
function addResponsibilityWithText(text = '') {
  const experienceItem = document.querySelector('.experience-item:last-child');
  const container = experienceItem.querySelector('.responsibilities-container');
  
  const div = document.createElement('div');
  div.className = 'flex items-center';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'responsibility';
  input.value = text;
  input.className = 'flex-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border';
  input.placeholder = 'Example: Developed and maintained web applications using React';
  
  input.addEventListener('input', function() {
    showResponsibilitySuggestions(this);
  });
  
  const button = document.createElement('button');
  button.type = 'button';
  button.addEventListener('click', () => removeResponsibility(div));
  button.className = 'ml-2 p-1 text-gray-400 hover:text-gray-600';
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'h-5 w-5');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('viewBox', '0 0 24 24');
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('d', 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16');
  
  svg.appendChild(path);
  button.appendChild(svg);
  
  div.appendChild(input);
  div.appendChild(button);
  container.appendChild(div);
}

// 3. Input suggestions for responsibilities
function showResponsibilitySuggestions(inputElement) {
  const inputValue = inputElement.value.toLowerCase();
  const suggestionsContainer = document.getElementById('responsibility-suggestions');

  // Get the job title to filter relevant responsibilities
  const jobTitleInput = inputElement.closest('.experience-item').querySelector('input[name="job-title"]');
  const jobTitle = jobTitleInput ? jobTitleInput.value.toLowerCase().trim() : '';

  // Clear previous suggestions
  suggestionsContainer.innerHTML = '';

  let suggestions = [];

  // If we have a job title, get responsibilities from our data
  if (jobTitle && resumeInputSuggestions[jobTitle]) {
    const source = resumeInputSuggestions[jobTitle];
    suggestions = inputValue
      ? source.filter(resp => resp.toLowerCase().includes(inputValue))
      : source;

    // Capitalize first letter of each suggestion
    suggestions = suggestions.map(sentence =>
      sentence.charAt(0).toUpperCase() + sentence.slice(1)
    );
  }

  // --- Position container (only once) ---
  document.body.appendChild(suggestionsContainer); // Ensure it's in the DOM
  const rect = inputElement.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  Object.assign(suggestionsContainer.style, {
    position: "absolute",
    top: `${rect.bottom + scrollTop}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  });

  // --- Populate container ---
  if (suggestions.length > 0) {
    suggestions.forEach(resp => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = resp;
      div.addEventListener('click', () => {
        inputElement.value = resp;
        suggestionsContainer.classList.add('hidden');
      });
      suggestionsContainer.appendChild(div);
    });

    suggestionsContainer.classList.remove('hidden');

  } else if (!jobTitle) {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.textContent = 'Please enter a job title to get relevant responsibility suggestions.';
    //give it a different style to indicate it's an info message
    div.style.fontStyle = 'italic';
    div.style.color = '#555';
    div.style.cursor = 'default';
    suggestionsContainer.appendChild(div);
    suggestionsContainer.classList.remove('hidden');

  } else {
    suggestionsContainer.classList.add('hidden');
  }
}

// Initialize event listeners for the first experience item on page load
function initializeInputSuggestion() {
  const jobTitleInput = document.querySelector('input[name="job-title"]');
  if (jobTitleInput) {
    jobTitleInput.addEventListener('input', function() {
      showJobTitleSuggestions(this);
    });
    // event listener to create new job title suggestion in the backend if not found
    jobTitleInput.addEventListener('change', async function() {
      const inputValue = this.value.toLowerCase().trim();
      createNewJobTitleSuggestion(inputValue);
    });
    setupKeyboardNavigation(document.getElementById('job-title-suggestions'), jobTitleInput);
  }
  
  const responsibilityInputs = document.querySelectorAll('input[name="responsibility"]');
  responsibilityInputs.forEach(input => {
    input.addEventListener('input', function() {
      showResponsibilitySuggestions(this);
    });
    input.addEventListener('focus', function() {
      showResponsibilitySuggestions(this);
    });

    setupKeyboardNavigation(document.getElementById('responsibility-suggestions'), input);
  });

  // Desired job title input
    const desiredJobTitleInput = document.querySelector('input[name="desired-job-title"]');
    if (desiredJobTitleInput) {
        desiredJobTitleInput.addEventListener('input', function() {
            showJobTitleSuggestions(this, document.getElementById('desired-job-title-suggestions'));
        });
        // event listener to create new job title suggestion in the backend if not found
        desiredJobTitleInput.addEventListener('change', async function() {
            const inputValue = this.value.toLowerCase().trim();
            createNewJobTitleSuggestion(inputValue);
        });
        setupKeyboardNavigation(document.getElementById('desired-job-title-suggestions'), desiredJobTitleInput);
    }
    
  
    // Hide suggestions when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.suggestions-container') && 
            !e.target.matches('input[name="job-title"], input[name="responsibility"], input[name="desired-job-title"]')) {
            // Select all suggestion boxes with a common class
            document.querySelectorAll('.suggestions-box').forEach(function(box) {
                box.classList.add('hidden');
            });
        }
    });
}

// Add keyboard navigation for suggestions
function setupKeyboardNavigation(suggestionsContainer, inputElement) {
  inputElement.addEventListener('keydown', async function(e) {
    const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
    const activeSuggestion = suggestionsContainer.querySelector('.suggestion-item.active');

    // If input element id is skill-input, add skill when comma is pressed
    if (inputElement.id == 'skill-input'){
      if (e.key === ',' && inputElement.value.trim()) {
          e.preventDefault();
          const skillInput = inputElement.value.trim().toLowerCase();
          const jobTitle = document.getElementById('desired-job-title').value.trim().toLowerCase();
          addSkill(skillInput);
          if (skillInput && jobTitle) createNewSkillSuggestion(jobTitle, skillInput);

      }
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!activeSuggestion) {
        suggestions[0]?.classList.add('active');
        suggestions[0]?.scrollIntoView({ block: 'nearest' });
      } else {
        const next = activeSuggestion.nextElementSibling;
        if (next) {
          activeSuggestion.classList.remove('active');
          next.classList.add('active');
          next.scrollIntoView({ block: 'nearest' });
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeSuggestion) {
        const prev = activeSuggestion.previousElementSibling;
        activeSuggestion.classList.remove('active');
        if (prev) {
          prev.classList.add('active');
          prev.scrollIntoView({ block: 'nearest' });
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion) {
        if (inputElement.id == 'skill-input'){
          addSkill(activeSuggestion.textContent);
          suggestionsContainer.style.display = 'none';
          inputElement.blur();
        } else {
        inputElement.value = activeSuggestion.textContent;
        suggestionsContainer.classList.add('hidden');
        }
        
      }
    } else if (e.key === 'Escape') {
      if (inputElement.id == 'skill-input'){
        suggestionsContainer.style.display = 'none';
        inputElement.blur();
      } else {
      suggestionsContainer.classList.add('hidden');
      }
    }
  });
}


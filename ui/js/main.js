/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 * @param {number} [duration=3000] - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = 'success', duration = 4000) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: duration,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    Toast.fire({
        icon: type,
        title: message,
        background: type === 'success' ? '#f0fdf4' : '#fef2f2', // Tailwind green-50/red-50
        color: type === 'success' ? '#166534' : '#991b1b',      // Tailwind green-800/red-800
        iconColor: type === 'success' ? '#22c55e' : '#ef4444'   // Tailwind green-500/red-500
    });
}

/**
 * Controls button enabled/disabled state with visual styling
 * @param {string} buttonId - The ID of the button element
 * @param {boolean} isDisabled - Whether to disable the button
 * @param {string} [disabledClass='opacity-50 cursor-not-allowed'] - Tailwind classes for disabled state
 */
function setButtonState(buttonId, isDisabled, enabledClass = 'bg-blue-600 hover:bg-blue-700') {
    const disabledClass = 'opacity-50 cursor-not-allowed'; // Tailwind classes for disabled state
    const button = document.getElementById(buttonId);
    
    if (!button) {
        console.error(`Button with ID "${buttonId}" not found`);
        return;
    }

    button.disabled = isDisabled;
    
    // Toggle visual disabled state
    if (isDisabled) {
        button.classList.add(...disabledClass.split(' '));
        // Optional: Change text color for better contrast
        button.classList.add('text-gray-500');
    } else {
        button.classList.remove(...disabledClass.split(' '));
        button.classList.remove('text-gray-500');
        // Restore original background color if needed
        button.classList.add(enabledClass); // Default enabled color
    }
}

// Function to toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
    // Select all password toggle buttons
    const toggleButtons = document.querySelectorAll('[data-password-toggle]');
    
    toggleButtons.forEach(button => {
        const targetId = button.getAttribute('data-password-toggle');
        const passwordInput = document.getElementById(targetId);
        const eyeIcon = button.querySelector('.eye-icon');
        const eyeSlashIcon = button.querySelector('.eye-slash-icon');
        
        // Click event handler
        button.addEventListener('click', function() {
            togglePasswordVisibility(passwordInput, eyeIcon, eyeSlashIcon);
        });
        
        // Touch event handler for mobile
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            togglePasswordVisibility(passwordInput, eyeIcon, eyeSlashIcon);
        });
    });
    
    function togglePasswordVisibility(input, eyeIcon, eyeSlashIcon) {
        // Toggle the password input type
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Toggle the eye icons
        eyeIcon.classList.toggle('hidden');
        eyeSlashIcon.classList.toggle('hidden');
    }
});


class ResumePreview {
  constructor(previewContainerId) {
    this.previewContainer = document.getElementById(previewContainerId);
    this.state = {
      personalInfo: {},
      experiences: [],
      education: [],
      skills: [],
      certifications: [],
      template: 'professional' // Default template
    };
  }

  // Update state and re-render
  updateSection(section, data) {
    this.state[section] = data;
    this.render();
  }

  // Set template type
  setTemplate(template) {
    this.state.template = template;
    this.render();
  }

  // Main render method
  render() {
    this.previewContainer.innerHTML = this.generatePreviewHTML();
  }

  // Generate HTML for the preview
  generatePreviewHTML() {
    if (this.state.template === 'professional') {
      return this.generateProfessionalTemplate();
    } else {
      return this.generateModernTemplate();
    }
  }

  /* ----------------------
     PROFESSIONAL TEMPLATE
     ---------------------- */
  generateProfessionalTemplatexxx() {
    return `
      <div class="resume-preview bg-white p-8 shadow-md border border-gray-200 font-sans">
        <!-- Header Section -->
        ${this.renderProfessionalHeader()}
        
        <!-- Professional Summary -->
        ${this.state.personalInfo.summary ? this.renderProfessionalSummary() : ''}
        
        <!-- Main Content Columns -->
        <div class="flex flex-col md:flex-row gap-8 mt-6">
          <!-- Left Column -->
          <div class="md:w-2/3 space-y-6">
            <!-- Work Experience -->
            ${this.state.experiences.length > 0 ? this.renderProfessionalExperiences() : ''}
            
            <!-- Education -->
            ${this.state.education.length > 0 ? this.renderProfessionalEducation() : ''}
          </div>
          
          <!-- Right Column -->
          <div class="md:w-1/3 space-y-6">
            <!-- Certifications -->
            ${this.state.certifications.length > 0 ? this.renderProfessionalCertifications() : ''}
            
            <!-- Skills -->
            ${this.state.skills.length > 0 ? this.renderProfessionalSkills() : ''}
          </div>
        </div>
      </div>
    `;
  }

  generateProfessionalTemplate() {
      return `
        <div class="resume-preview bg-white p-8 shadow-md border border-gray-200 font-sans max-w-4xl mx-auto">
          <!-- Header Section -->
          ${this.renderProfessionalHeader()}
          
          <!-- Professional Summary -->
          ${this.state.personalInfo.summary ? this.renderProfessionalSummary() : ''}
          
          <!-- Main Content - Single Column -->
          <div class="space-y-8 mt-6">
            <!-- Work Experience -->
            ${this.state.experiences.length > 0 ? this.renderProfessionalExperiences() : ''}
            
            <!-- Education -->
            ${this.state.education.length > 0 ? this.renderProfessionalEducation() : ''}
            
            <!-- Certifications -->
            ${this.state.certifications.length > 0 ? this.renderProfessionalCertifications() : ''}
            
            <!-- Skills -->
            ${this.state.skills.length > 0 ? this.renderProfessionalSkills() : ''}
          </div>
        </div>
      `;
  }

  renderProfessionalHeader() {
    const { first_name, last_name, other_name, email, phone, linkedin, portfolio, git, city, state, country } = this.state.personalInfo;
    return `
      <header class="text-center border-b border-gray-200 pb-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight">
          ${first_name || 'First'} ${other_name ? other_name + ' ' : ''}${last_name || 'Last'}
        </h1>
        <p class="text-gray-600 mt-1">${city || 'City'}, ${state || 'State'}, ${country || 'Country'}</p>
        <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
          ${email ? `<span class="text-sm text-gray-600">${email}</span>` : ''}
          ${phone ? `<span class="text-sm text-gray-600">${phone}</span>` : ''}
          ${linkedin ? `<a href="https://linkedin.com/in/${linkedin}" class="text-sm text-blue-600 hover:underline">LinkedIn</a>` : ''}
          ${portfolio ? `<a href="${portfolio}" class="text-sm text-blue-600 hover:underline">Portfolio</a>` : ''}
          ${git ? `<a href="${git}" class="text-sm text-blue-600 hover:underline">GitHub</a>` : ''}
        </div>
      </header>
    `;
  }

  renderProfessionalSummary() {
    return `
      <section class="mb-6">
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
        <p class="text-gray-700">${this.state.personalInfo.summary}</p>
      </section>
    `;
  }

  renderProfessionalExperiences() {
    return `
      <section>
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-4">PROFESSIONAL EXPERIENCE</h2>
        ${this.state.experiences.map(exp => `
          <div class="mb-6">
            <div class="flex justify-between">
              <h3 class="font-medium text-gray-800">${exp.job_title || 'Position'}</h3>
              <span class="text-sm text-gray-600">
                ${exp.start_date || 'Start'} - ${exp.current ? 'Present' : (exp.end_date || 'End')}
              </span>
            </div>
            <p class="text-gray-600 italic">${exp.company || 'Company'}</p>
            ${exp.responsibilities && exp.responsibilities.length > 0 ? `
              <ul class="mt-2 list-disc list-inside space-y-1">
                ${exp.responsibilities.map(resp => `<li class="text-gray-700">${resp}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </section>
    `;
  }

  renderProfessionalEducation() {
    return `
      <section>
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-4">EDUCATION</h2>
        ${this.state.education.map(edu => `
          <div class="mb-4">
            <div class="flex justify-between">
              <h3 class="font-medium text-gray-800">${edu.degree || 'Degree'}</h3>
              <span class="text-sm text-gray-600">${edu.graduation || 'Graduation'}</span>
            </div>
            <p class="text-gray-600">${edu.institution || 'Institution'}</p>
            ${edu.field ? `<p class="text-gray-600 italic">${edu.field}</p>` : ''}
          </div>
        `).join('')}
      </section>
    `;
  }

  renderProfessionalCertifications() {
    return `
      <section>
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-4">CERTIFICATIONS</h2>
        ${this.state.certifications.map(cert => `
          <div class="mb-3">
            <h3 class="font-medium text-gray-800">${cert.name || 'Certification Name'}</h3>
            ${cert.organization ? `<p class="text-sm text-gray-600">${cert.organization}</p>` : ''}
            <p class="text-xs text-gray-500 mt-1">
              ${cert.date_earned || 'Date earned'} 
              ${cert.expiry_date && !cert.no_expiry ? `- ${cert.expiry_date}` : ''}
              ${cert.no_expiry ? '(No expiry)' : ''}
            </p>
          </div>
        `).join('')}
      </section>
    `;
  }

  renderProfessionalSkills() {
    return `
      <section>
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-4">SKILLS</h2>
        <div class="flex flex-wrap gap-2">
          ${this.state.skills.map(skill => `
            <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">${skill}</span>
          `).join('')}
        </div>
      </section>
    `;
  }

  /* ----------------------
     MODERN TEMPLATE
     ---------------------- */
  generateModernTemplate() {
    return `
      <div class="resume-preview bg-white p-6 shadow-lg border border-gray-200 font-sans">
        <!-- Two-column layout -->
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Left sidebar -->
          <div class="md:w-1/3 bg-gray-50 p-6 rounded-lg">
            ${this.renderModernHeader()}
            
            <!-- Contact Info -->
            <div class="mt-6">
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact</h3>
              ${this.renderModernContactInfo()}
            </div>
            
            <!-- Skills -->
            ${this.state.skills.length > 0 ? `
              <div class="mt-6">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</h3>
                ${this.renderModernSkills()}
              </div>
            ` : ''}
            
            <!-- Certifications -->
            ${this.state.certifications.length > 0 ? `
              <div class="mt-6">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Certifications</h3>
                ${this.renderModernCertifications()}
              </div>
            ` : ''}
          </div>
          
          <!-- Main content -->
          <div class="md:w-2/3 space-y-6">
            <!-- Summary -->
            ${this.state.personalInfo.summary ? this.renderModernSummary() : ''}
            
            <!-- Experience -->
            ${this.state.experiences.length > 0 ? this.renderModernExperiences() : ''}
            
            <!-- Education -->
            ${this.state.education.length > 0 ? this.renderModernEducation() : ''}
          </div>
        </div>
      </div>
    `;
  }

  renderModernHeader() {
    const { first_name, last_name, other_name } = this.state.personalInfo;
    return `
      <header class="text-center">
        <h1 class="text-2xl font-bold text-gray-800">
          <span class="block">${first_name || 'First'}</span>
          <span class="block text-blue-600">${other_name ? other_name + ' ' : ''}${last_name || 'Last'}</span>
        </h1>
      </header>
    `;
  }

  renderModernContactInfo() {
    const { email, phone, linkedin, portfolio, git, city, state, country } = this.state.personalInfo;
    return `
      <ul class="space-y-2">
        ${email ? `
          <li class="flex items-start"> <!-- Changed from items-center to items-start -->
            <svg class="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
              <path stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span class="text-sm text-gray-700 break-words min-w-0">${email}</span>
          </li>
        ` : ''}
        
        ${phone ? `
          <li class="flex items-center">
            <svg class="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span class="text-sm">${phone}</span>
          </li>
        ` : ''}
        
        ${city || state || country ? `
          <li class="flex items-center">
            <svg class="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-sm">${[city, state, country].filter(Boolean).join(', ')}</span>
          </li>
        ` : ''}
        
        ${linkedin ? `
          <li class="flex items-center min-w-0">
            <svg class="h-4 w-4 text-[#0A66C2] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <a href="https://linkedin.com/in/${linkedin}" 
              class="text-sm text-[#0A66C2] hover:underline hover:text-[#004182] truncate min-w-0"
              title="${linkedin}">
              linkedin.com/in/${linkedin}
            </a>
          </li>
        ` : ''}
        
        ${portfolio ? `
          <li class="flex items-center">
            <svg class="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
            <a href="${portfolio}" class="text-sm text-blue-600 hover:underline">${portfolio.replace(/^https?:\/\//, '')}</a>
          </li>
        ` : ''}
        
        ${git ? `
          <li class="flex items-center">
            <svg class="h-4 w-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <a href="${git}" class="text-sm text-blue-600 hover:underline">${git.replace(/^https?:\/\//, '')}</a>
          </li>
        ` : ''}
      </ul>
    `;
  }

  renderModernSummary() {
    return `
      <section class="bg-gray-50 p-4 rounded-lg">
        <h2 class="text-lg font-semibold text-gray-800 mb-2">About Me</h2>
        <p class="text-gray-700">${this.state.personalInfo.summary}</p>
      </section>
    `;
  }

  renderModernExperiences() {
    return `
      <section>
        <h2 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-4">EXPERIENCE</h2>
        ${this.state.experiences.map(exp => `
          <div class="mb-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-800">${exp.job_title || 'Position'}</h3>
                <p class="text-blue-600">${exp.company || 'Company'}</p>
              </div>
              <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ${exp.start_date || 'Start'} - ${exp.current ? 'Present' : (exp.end_date || 'End')}
              </span>
            </div>
            ${exp.responsibilities && exp.responsibilities.length > 0 ? `
              <ul class="mt-2 space-y-1">
                ${exp.responsibilities.map(resp => `
                  <li class="flex items-start">
                    <span class="text-blue-500 mr-2">•</span>
                    <span class="text-gray-700">${resp}</span>
                  </li>
                `).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </section>
    `;
  }

  renderModernEducation() {
    return `
      <section>
        <h2 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-4">EDUCATION</h2>
        ${this.state.education.map(edu => `
          <div class="mb-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-800">${edu.degree || 'Degree'}</h3>
                <p class="text-gray-600">${edu.institution || 'Institution'}</p>
                ${edu.field ? `<p class="text-sm text-gray-500">${edu.field}</p>` : ''}
              </div>
              <span class="text-sm text-gray-500">${edu.graduation || 'Graduation'}</span>
            </div>
          </div>
        `).join('')}
      </section>
    `;
  }

  renderModernCertifications() {
    return `
      <ul class="space-y-3">
        ${this.state.certifications.map(cert => `
          <li>
            <h4 class="font-medium text-gray-800">${cert.name || 'Certification'}</h4>
            ${cert.organization ? `<p class="text-sm text-gray-600">${cert.organization}</p>` : ''}
            <p class="text-xs text-gray-500 mt-1">
              <span class="font-medium">Issued:</span> ${cert.date_earned || 'N/A'}
              ${cert.expiry_date && !cert.no_expiry ? ` • <span class="font-medium">Expires:</span> ${cert.expiry_date}` : ''}
              ${cert.no_expiry ? ' • <span class="font-medium">No expiry</span>' : ''}
            </p>
          </li>
        `).join('')}
      </ul>
    `;
  }

  renderModernSkills() {
    return `
      <div class="grid grid-cols-1 gap-2">
        ${this.state.skills.map(skill => `
          <span class="px-2 py-1 bg-white border border-gray-200 text-gray-800 rounded text-sm text-center">${skill}</span>
        `).join('')}
      </div>
    `;
  }
}

// API utility for downloading resume files from the server
async function downloadResume(filename) {
        await API.request(`/api/download/${filename}/`)
            .then(res => res.blob())
            .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            });
    }

// check if user is a premium user
function isPremiumUser() {
    const user = API.getUser();
    if (user.account_type == 'premium') {
        return true;
    } else {
        return false;
    }
}

// check if user has resume credits
function hasResumeCredits() {
    const user = API.getUser();
    if (user.resume_credits > 0) {
        return true;
    } else {
        return false;
    }
}

// general function for toggling button spinners
function toggleButtonSpinner(btnId, btnText, isLoading=true, loadingText='Loading...') {
    // create the necessary elements and toggle their visibility
    const button = document.getElementById(btnId);
    if (!button) {
        console.error(`Button with ID "${btnId}" not found`);
        return;
    }

    if (isLoading) {
        // Show spinner and hide text
        button.innerHTML = `<span id="btn-text">${loadingText}</span><span id="btn-spinner" class="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>`;
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        // Hide spinner and show text
        const spinner = button.querySelector('#btn-spinner');
        if (spinner) {
            spinner.remove();
        }
        const btnTextElement = button.querySelector('#btn-text');
        if (btnTextElement) {
            btnTextElement.textContent = btnText;
        } else {
            button.innerHTML = `<span id="btn-text">${btnText}</span>`;
        }
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// async function to prompt user to get premium
async function showPremiumRequiredModal(text = 'Get access to unlimited resume downloads and premium features.') {
    const { value: confirmed } = await Swal.fire({
        title: 'Upgrade to Premium', 
        text: text,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Get Premium Now',
        cancelButtonText: 'Maybe Later'
    });

    if (confirmed) {
        window.location.href = '/premium';
    }
}

// Function to export data to Excel using XLSX.js
function exportAnalyticsDataToExcel(data) {
    // Create a workbook with multiple sheets for different sections
    const workbook = XLSX.utils.book_new();
    
    // Helper function to safely get nested properties
    const getSafe = (obj, path, defaultValue = 0) => {
        return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
    };
    
    // Helper function to format currency
    const formatCurrency = (value) => {
        const symbol = getSafe(data, 'currency.symbol', '');
        return value !== undefined ? `${symbol}${value}` : `${symbol}0`;
    };
    
    // Helper function to format percentage
    const formatPercentage = (value, total = 1) => {
        if (value === undefined) return '0%';
        if (typeof value === 'number') return `${value.toFixed(2)}%`;
        return `${((value / total) * 100).toFixed(2)}%`;
    };
    
    // 1. Main Summary Sheet
    const summaryData = [
        ["Metric", "Value"],
        ["Total Revenue", formatCurrency(getSafe(data, 'total_revenue'))],
        ["Active Users", getSafe(data, 'active_users')],
        ["New Customers", getSafe(data, 'customer_acquisition.new_customers')],
        ["Customer Acquisition Cost", formatCurrency(getSafe(data, 'customer_acquisition.cac'))]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    
    // 2. Revenue Breakdown Sheet
    const totalRevenue = getSafe(data, 'total_revenue', 1); // Avoid division by zero
    const revenueData = [
        ["Revenue Type", "Amount", "Percentage"],
        ["Total Revenue", formatCurrency(totalRevenue), "100%"],
        ["Credit Purchases", formatCurrency(getSafe(data, 'credit_purchases.total_revenue')), 
         formatPercentage(getSafe(data, 'credit_purchases.total_revenue'), totalRevenue)],
        ["Subscriptions", formatCurrency(getSafe(data, 'subscriptions.total_revenue')), 
         formatPercentage(getSafe(data, 'subscriptions.total_revenue'), totalRevenue)],
        [],
        ["Subscription Plan", "Revenue", "Percentage"]
    ];
    
    // Add subscription plans if they exist
    const subscriptionPlans = getSafe(data, 'subscriptions.by_plan', {});
    for (const [planName, planData] of Object.entries(subscriptionPlans)) {
        revenueData.push([
            planName,
            formatCurrency(getSafe(planData, 'revenue')),
            formatPercentage(getSafe(planData, 'percentage'))
        ]);
    }
    
    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
    XLSX.utils.book_append_sheet(workbook, revenueSheet, "Revenue Breakdown");
    
    // 3. Recent Orders Sheet
    const ordersHeader = ["Order #", "Date", "Type", "Amount", "Payment Method", "Status", "Customer", "Email", "Plan"];
    const ordersData = [ordersHeader];
    
    const recentOrders = getSafe(data, 'recent_orders', []);
    for (const order of recentOrders) {
        ordersData.push([
            getSafe(order, 'order_number', 'N/A'),
            order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A',
            getSafe(order, 'order_type', 'N/A'),
            formatCurrency(getSafe(order, 'total')),
            getSafe(order, 'payment_method', 'N/A'),
            getSafe(order, 'payment_status', 'N/A'),
            `${getSafe(order, 'user__first_name', '')} ${getSafe(order, 'user__last_name', '')}`.trim() || 'N/A',
            getSafe(order, 'user__email', 'N/A'),
            getSafe(order, 'subscription__subscription_type__name', 'N/A')
        ]);
    }
    
    const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData);
    XLSX.utils.book_append_sheet(workbook, ordersSheet, "Recent Orders");
    
    // 4. Plan Performance Sheet
    const planHeader = ["Plan", "Subscribers", "MRR", "Avg Lifetime", "Churn Rate", "Conversion Rate", "Renewal Rate"];
    const planData = [planHeader];
    
    const planPerformance = getSafe(data, 'plan_performance', []);
    for (const plan of planPerformance) {
        planData.push([
            getSafe(plan, 'plan', 'N/A'),
            getSafe(plan, 'subscribers', 0),
            formatCurrency(getSafe(plan, 'mrr')),
            getSafe(plan, 'avg_lifetime', 'N/A'),
            formatPercentage(getSafe(plan, 'churn_rate')),
            formatPercentage(getSafe(plan, 'conversion_rate')),
            formatPercentage(getSafe(plan, 'renewal_rate'))
        ]);
    }
    
    const planSheet = XLSX.utils.aoa_to_sheet(planData);
    XLSX.utils.book_append_sheet(workbook, planSheet, "Plan Performance");
    
    // Generate and download the Excel file
    const fileName = `Revenue_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}

const toTitleCase = str =>
  str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

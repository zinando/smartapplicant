/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 * @param {number} [duration=3000] - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = 'success', duration = 3000) {
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

class ResumePreview {
  constructor(previewContainerId) {
    this.previewContainer = document.getElementById(previewContainerId);
    this.state = {
      personalInfo: {},
      experiences: [],
      education: [],
      skills: [],
      certifications: []  // <-- Added certifications
    };
  }

  // Update state and re-render
  updateSection(section, data) {
    this.state[section] = data;
    this.render();
  }

  // Main render method
  render() {
    this.previewContainer.innerHTML = this.generatePreviewHTML();
  }

  // Generate HTML for the preview
  generatePreviewHTML() {
    return `
      <div class="resume-preview bg-white p-6 shadow-md border border-gray-200">
        <!-- Header Section -->
        ${this.renderHeader()}
        
        <!-- Professional Summary -->
        ${this.state.personalInfo.summary ? this.renderSummary() : ''}
        
        <!-- Work Experience -->
        ${this.state.experiences.length > 0 ? this.renderExperiences() : ''}
        
        <!-- Education -->
        ${this.state.education.length > 0 ? this.renderEducation() : ''}
        
        <!-- Certifications -->
        ${this.state.certifications.length > 0 ? this.renderCertifications() : ''}
        
        <!-- Skills -->
        ${this.state.skills.length > 0 ? this.renderSkills() : ''}
      </div>
    `;
  }

  renderHeader() {
    const { first_name, last_name, other_name, email, phone, linkedin, portfolio, city, state, country} = this.state.personalInfo;
    return `
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          ${first_name || 'First'} ${other_name ? other_name + ' ' : ''}${last_name || 'Last'}
        </h1>
        <p class="text-gray-600">${city || 'City'}, ${state || 'State'}, ${country || 'Country'}</p>
        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          ${email ? `<span class="text-sm text-gray-600">${email}</span>` : ''}
          ${phone ? `<span class="text-sm text-gray-600">${phone}</span>` : ''}
          ${linkedin ? `<a href="https://linkedin.com/in/${linkedin}" class="text-sm text-blue-600 hover:underline">LinkedIn</a>` : ''}
          ${portfolio ? `<a href="${portfolio}" class="text-sm text-blue-600 hover:underline">Portfolio</a>` : ''}
        </div>
      </header>
    `;
  }

  renderSummary() {
    return `
      <section class="mb-6">
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Professional Summary</h2>
        <p class="text-gray-700">${this.state.personalInfo.summary}</p>
      </section>
    `;
  }

  renderExperiences() {
    return `
      <section class="mb-6">
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Work Experience</h2>
        ${this.state.experiences.map(exp => `
          <div class="mb-4">
            <div class="flex justify-between">
              <h3 class="font-medium">${exp.job_title || 'Position'}</h3>
              <span class="text-sm text-gray-600">
                ${exp.start_date || 'Start'} to ${exp.current ? 'Present' : (exp.end_date || 'End')}
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

  renderEducation() {
    return `
      <section class="mb-6">
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Education</h2>
        ${this.state.education.map(edu => `
          <div class="mb-4">
            <div class="flex justify-between">
              <h3 class="font-medium">${edu.degree || 'Degree'}</h3>
              <span class="text-sm text-gray-600">${edu.graduation || 'Graduation'}</span>
            </div>
            <p class="text-gray-600">${edu.institution || 'Institution'}</p>
            ${edu.field ? `<p class="text-gray-600 italic">${edu.field}</p>` : ''}
          </div>
        `).join('')}
      </section>
    `;
  }

  renderCertifications() {
    return `
      <section class="mb-6">
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Certifications</h2>
        ${this.state.certifications.map(cert => `
          <div class="mb-2">
            <h3 class="font-medium">${cert.name || 'Certification Name'}</h3>
            ${cert.organization ? `<p class="text-gray-600">Issued by: ${cert.organization}</p>` : ''}
            ${cert.date_earned ? `<p class="text-sm text-gray-500">Date: ${cert.date_earned}</p>` : ''}
            ${`<p class="text-sm text-gray-500">Expires: ${cert.no_expiry? 'never' : cert.expiry_date}</p>`}
          </div>
        `).join('')}
      </section>
    `;
  }

  renderSkills() {
    return `
      <section>
        <h2 class="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">Skills</h2>
        <div class="flex flex-wrap gap-2">
          ${this.state.skills.map(skill => `
            <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">${skill}</span>
          `).join('')}
        </div>
      </section>
    `;
  }
}

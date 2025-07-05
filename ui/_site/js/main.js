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
    const { first_name, last_name, other_name, email, phone, linkedin, portfolio, git, city, state, country} = this.state.personalInfo;
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
          ${git ? `<a href="${git}" class="text-sm text-blue-600 hover:underline">GitHub</a>` : ''}
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

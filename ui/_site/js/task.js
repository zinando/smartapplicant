async function pollTaskResults(taskId) {
    const resultsDiv = document.getElementById('results');
    let attempts = 0;
    const maxAttempts = 30; // ~3 mins timeout
    
    while (attempts < maxAttempts) {
        const response = await fetch(`/api/task-status/${taskId}/`);
        const data = await response.json();
        
        if (data.data.status === 'SUCCESS') {
            renderFinalResults(data.data.result);
            return;
        } else if (data.data.status === 'FAILURE') {
            showError('Processing failed');
            return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000)); // Poll every 3s
        attempts++;
    }
    
    showError('Processing timed out');
} 


function renderFinalResults(data) {
    const resultsDiv = document.getElementById('results');
    
    // Create section display HTML
    let sectionsHtml = '';
    for (const [section, content] of Object.entries(data.required_sections)) {
        if (content && section !== 'errors') {
            sectionsHtml += `
                <div class="mb-6">
                    <h4 class="font-semibold text-gray-800 mb-2 capitalize">${section.replace('_', ' ')}</h4>
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        ${formatSectionContent(section, content)}
                    </div>
                </div>
            `;
        } else if (section !== 'errors') {
            sectionsHtml += `
                <div class="mb-6">
                    <h4 class="font-semibold text-gray-800 mb-2 capitalize">${section.replace('_', ' ')}</h4>
                    <div class="bg-red-50 p-4 rounded-lg border border-red-200 text-red-600">
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        No structured data detected
                    </div>
                </div>
            `;
        }
    }

    resultsDiv.innerHTML = `
        <div class="space-y-6">
            <div>
                <h3 class="text-xl font-bold text-gray-900 mb-4">Resume Analysis Report</h3>
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">ATS Compatibility Score</span>
                    <span class="font-bold">${data.ats_score}/100</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${data.ats_score}%"></div>
                </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
                <h4 class="font-semibold text-lg mb-4">Extracted Information</h4>
                ${sectionsHtml}
            </div>

            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 class="font-semibold text-blue-800 mb-2 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Recommendations
                </h4>
                <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    ${generateRecommendations(data.required_sections, data.required_sections.errors)}
                </ul>
            </div>

            <!-- New CTA Section -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-blue-100 text-center">
                <h4 class="font-semibold text-lg text-gray-800 mb-3">Want to boost your chances further?</h4>
                <p class="text-gray-600 mb-4">Compare your resume against specific job descriptions to see how well you match the requirements.</p>
                <div class="flex flex-col sm:flex-row justify-center gap-3">
                    <a href="/signup" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-sm">
                        Sign Up For A Free Account
                    </a>
                    <a href="/how_it_works" class="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg transition duration-200">
                        See How It Works
                    </a>
                </div>
                <p class="text-xs text-gray-500 mt-3">Get personalized matching insights in 2 minutes</p>
            </div>
        </div>
    `;
}

// Helper function to format different section contents
function formatSectionContent(section, content) {
    if (!content) return '<p class="text-gray-500">Not detected</p>';
    
    switch(section) {
        case 'skills':
            return `<ul class="list-disc pl-5 space-y-1">${
                Array.isArray(content) 
                    ? content.map(skill => `<li>${skill}</li>`).join('')
                    : `<li>${content}</li>`
            }</ul>`;
        
        case 'education':
            // Handle structured education data
            if (Array.isArray(content)) {
                // return content.map(item => `
                //     <div class="mb-3 pb-3 border-b border-gray-100 last:border-0">
                //         ${item.degree ? `<p class="font-medium">${item.degree}${item.field ? ` in ${item.field}` : ''}</p>` : ''}
                //         ${item.institution ? `<p class="text-gray-600">${item.institution}</p>` : ''}
                //         ${item.date ? `<p class="text-sm text-gray-500">${item.date}</p>` : ''}
                //         ${item.description ? `<p class="mt-1 text-gray-600 text-sm">${item.description}</p>` : ''}
                //         ${item.location ? `<p class="text-xs text-gray-500">${item.location}</p>` : ''}
                //     </div>
                // `).join('');
                return content.map(item => `
                    <div class="mb-3 pb-3 border-b border-gray-100 last:border-0">
                        <div class="flex justify-between items-start">
                            <div>
                                ${item.degree ? `<p class="font-medium">${item.degree}${item.field ? ` in ${item.field}` : ''}</p>` : ''}
                            </div>
                            ${item.date ? `<p class="text-sm text-gray-500">${item.date}</p>` : ''}
                        </div>
                        ${item.institution ? `
                            <p class="text-gray-600">
                                ${item.institution}
                                ${item.location ? ` - ${item.location}` : ''}
                            </p>
                        ` : ''}
                        ${item.description ? `<p class="mt-1 text-gray-600 text-sm italic">${item.description}</p>` : ''}
                    </div>
                `).join('');
            }
            // Fallback to plain text
            return `<p class="text-gray-700">${content}</p>`;
            
        case 'experience':
            // Handle both structured and plain text experience
            if (Array.isArray(content)) {
                return content.map(item => `
                    <div class="mb-3 pb-3 border-b border-gray-100 last:border-0">
                        ${item.title ? `<p class="font-medium">${item.title}</p>` : ''}
                        ${item.company ? `<p class="text-gray-600">${item.company}</p>` : ''}
                        ${item.duration ? `<p class="text-sm text-gray-500">${item.duration}</p>` : ''}
                        ${item.description ? `<p class="mt-1 text-gray-600 text-sm">${item.description}</p>` : ''}
                    </div>
                `).join('');
            }
            // Plain text experience
            return `<div class="whitespace-pre-line text-gray-700">${content}</div>`;
            
        case 'certificates':
            return content.map(cert => `
                <div class="mb-2">
                    <p class="font-medium">${cert.name || 'Unnamed Certificate'}</p>
                    ${cert.issuer ? `<p class="text-sm text-gray-600">${cert.issuer}</p>` : ''}
                    ${cert.date ? `<p class="text-xs text-gray-500">${cert.date}</p>` : ''}
                </div>
            `).join('');
            
        default:
            return `<p class="text-gray-700">${content}</p>`;
    }
}
// Helper function to generate targeted recommendations
function generateRecommendations(data, backend_recommendations = []) {

    const recommendations = backend_recommendations || [];

    if (!recommendations || recommendations.length === 0) {
        
        if (!data.experience || data.experience.length === 0) {
            recommendations.push("Add a clearly marked 'Experience' section with job titles and durations");
        }
        
        if (!data.education || data.education.length === 0) {
            recommendations.push("Include your educational background with institution names and dates");
        }
        
        if (!data.skills || data.skills.length < 3) {
            recommendations.push("List at least 5-8 relevant skills in a dedicated 'Skills' section");
        }
        
        if (!data.certificates || data.certificates.length === 0) {
            recommendations.push("Highlight any professional certifications you've earned");
        }
        
        if (!data.email || !data.phone) {
            recommendations.push("Ensure your contact information (email & phone) is clearly stated, and correctly formatted. Use a professional email address. For best practices, use a phone number with country code: +1-234-567-8901");
        }
        if (!data.name) {
            recommendations.push("Name should appear at the top of your resume, specifically on the first line. Namse should be in upper case or title case, e.g. 'John Doe' or 'JOHN DOE'.");
        }
    }
    
    return recommendations.map(rec => `<li>${rec}</li>`).join('');
}
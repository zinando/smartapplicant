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
    resultsDiv.innerHTML = `
        <h3 class="font-bold mb-2">Analysis Complete</h3>
        <div class="mb-4">
            <span class="font-semibold">ATS Score:</span>
            <div class="w-full bg-gray-200 rounded h-4 mt-1">
                <div class="bg-blue-600 h-4 rounded" 
                     style="width: ${data.ats_score}%"></div>
            </div>
            <p class="text-right text-sm">${data.ats_score}/100</p>
        </div>
        <details>
            <summary class="text-blue-600 cursor-pointer">Suggestions</summary>
            <ul class="mt-2 pl-5 list-disc text-sm">
                <li>Add 2 more skills from the job description</li>
                <li>Include project duration dates</li>
            </ul>
        </details>
    `;
}

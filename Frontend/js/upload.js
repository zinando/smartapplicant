document.getElementById('resume-upload').addEventListener('change', (e) => {
    const fileDisplay = document.getElementById('file-display');
    const fileName = document.getElementById('file-name');
    
    if (e.target.files.length > 0) {
      fileDisplay.classList.remove('hidden');
      fileName.textContent = e.target.files[0].name;
    } else {
      fileDisplay.classList.add('hidden');
    }
});

document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('resume-upload').files[0];
    const resultsDiv = document.getElementById('results');
    
    if (!file) {
        showError('Please select a file');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showError('File exceeds 5MB limit');
        return;
    }

    try {
        resultsDiv.innerHTML = '<p class="text-blue-700">Processing...</p>';
        resultsDiv.classList.remove('hidden');

        const formData = new FormData();
        formData.append('resume', file);

        const response = await fetch('http://localhost:8000/api/parse/', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.status === 1) {
            showResults(data.data);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Network error - please try again');
    }
});

// Modify showResults() to handle async tasks
async function showResults(data) {
    const resultsDiv = document.getElementById('results');
    
    if (data.task_id) {
        resultsDiv.innerHTML = `
            <div class="text-center">
                <div class="spinner mb-2"></div>
                <p>Processing large file...</p>
            </div>
        `;
        await pollTaskResults(data.task_id);
    } else {
        renderFinalResults(data);
    }
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p class="text-red-600">${message}</p>`;
    resultsDiv.classList.remove('hidden');
}
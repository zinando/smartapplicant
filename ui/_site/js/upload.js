document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('resume-upload').addEventListener('change', (e) => {
        const fileDisplay = document.getElementById('file-display');
        const fileName = document.getElementById('file-name');
        const uploadButtonContainer = document.getElementById('upload-button-container');
        
        if (e.target.files.length > 0) {
            
            uploadButtonContainer.classList.add('h-40');
            uploadButtonContainer.classList.remove('h-32');
            fileDisplay.classList.remove('hidden');
            fileName.textContent = e.target.files[0].name.slice(0, 35) + (e.target.files[0].name.length > 35 ? '...' : '');
        } else {
            fileDisplay.classList.add('hidden');
            uploadButtonContainer.classList.remove('h-40');
            uploadButtonContainer.classList.add('h-32');
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

            const response = await API.request('/api/parse/', 'POST', formData, true);

            const data = await response.json();
            
            if (data.status === 1) {
                // console.log(data.data);
                showResults(data.data);
            } else {
                showError(data.message);
            }
        } catch (error) {
            showError('Network error - please try again');
        }
    });
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
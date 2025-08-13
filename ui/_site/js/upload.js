// document.addEventListener('DOMContentLoade', () => {
//     document.getElementById('resume-uplad').addEventListener('change', (e) => {
//         const fileDisplay = document.getElementById('file-display');
//         const fileName = document.getElementById('file-name');
//         const uploadButtonContainer = document.getElementById('upload-button-container');
        
//         if (e.target.files.length > 0) {
            
//             uploadButtonContainer.classList.add('h-40');
//             uploadButtonContainer.classList.remove('h-32');
//             fileDisplay.classList.remove('hidden');
//             fileName.textContent = e.target.files[0].name.slice(0, 35) + (e.target.files[0].name.length > 35 ? '...' : '');
//         } else {
//             fileDisplay.classList.add('hidden');
//             uploadButtonContainer.classList.remove('h-40');
//             uploadButtonContainer.classList.add('h-32');
//         }
//     });

//     document.getElementById('upload-form').addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const file = document.getElementById('resume-upload').files[0];
//         const resultsDiv = document.getElementById('results');
        
//         if (!file) {
//             showError('Please select a file');
//             return;
//         }

//         if (file.size > 5 * 1024 * 1024) {
//             showError('File exceeds 5MB limit');
//             return;
//         }

//         try {
//             resultsDiv.innerHTML = '<p class="text-blue-700">Processing...</p>';
//             resultsDiv.classList.remove('hidden');

//             const formData = new FormData();
//             formData.append('resume', file);

//             const response = await API.request('/api/parse/', 'POST', formData, true);

//             const data = await response.json();
            
//             if (data.status === 1) {
//                 // console.log(data.data);
//                 showResults(data.data);
//             } else {
//                 showError(data.message);
//             }
//         } catch (error) {
//             showError('Network error - please try again');
//         }
//     });
// });


document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('resume-upload');
    const fileDisplay = document.getElementById('file-display');
    const fileNameSpan = document.getElementById('file-name');
    const uploadButtonContainer = document.getElementById('upload-button-container');
    const resultsDiv = document.getElementById('results');

    // Utility: Check file is readable (handles cloud files)
    function verifyFileReadable(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(true);
            reader.onerror = () => reject(false);
            reader.readAsArrayBuffer(file);
        });
    }

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const name = e.target.files[0].name;
            uploadButtonContainer.classList.add('h-40');
            uploadButtonContainer.classList.remove('h-32');
            fileDisplay.classList.remove('hidden');
            fileNameSpan.textContent = name.length > 25 ? name.slice(0, 25) + '...' : name;
        } else {
            fileDisplay.classList.add('hidden');
            uploadButtonContainer.classList.remove('h-40');
            uploadButtonContainer.classList.add('h-32');
        }
    });

    // Drag-and-drop support
    ['dragenter', 'dragover'].forEach(evt =>
        uploadButtonContainer.addEventListener(evt, e => {
            e.preventDefault();
            uploadButtonContainer.classList.add('bg-gray-100');
        })
    );

    ['dragleave', 'drop'].forEach(evt =>
        uploadButtonContainer.addEventListener(evt, e => {
            e.preventDefault();
            uploadButtonContainer.classList.remove('bg-gray-100');
        })
    );

    uploadButtonContainer.addEventListener('drop', e => {
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });

    // Handle form submission
    document.getElementById('upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];

        if (!file) {
            showError('Please select a file');
            return;
        }

        // Validate size
        if (file.size > 5 * 1024 * 1024) {
            showError('File exceeds 5MB limit');
            return;
        }

        // Validate extension
        const allowedExt = ['pdf', 'docx'];
        const ext = file.name.split('.').pop().toLowerCase();
        if (!allowedExt.includes(ext)) {
            showError('Only PDF and DOCX files are allowed');
            return;
        }

        // Check if file can be read (important for cloud uploads)
        try {
            await verifyFileReadable(file);
        } catch {
            showError('Unable to read file. If selecting from the cloud, ensure it is fully downloaded.');
            return;
        }

        try {
            resultsDiv.innerHTML = '<p class="text-blue-700">Processing...</p>';
            resultsDiv.classList.remove('hidden');

            const formData = new FormData();
            formData.append('resume', file);

            const response = await API.request('/api/parse/', 'POST', formData, true);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.status === 1) {
                showResults(data.data);
            } else {
                showError(data.message);
            }
        } catch (error) {
            showError(error.message || 'Network error - please try again');
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
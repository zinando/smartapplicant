// Dashboard specific functionality
document.addEventListener('DOMContentLoaded', () => {
    // Resume selection
    const resumeCards = document.querySelectorAll('.resume-card');
    resumeCards.forEach(card => {
        card.addEventListener('click', () => {
            document.querySelector('.resume-card.border-blue-300')?.classList.remove('border-blue-300', 'bg-blue-50', 'hover:border-blue-500');
            document.querySelector('.resume-card span.bg-blue-100')?.remove();
            
            card.classList.add('border-blue-300', 'bg-blue-50', 'hover:border-blue-500');
            
            const activeBadge = document.createElement('span');
            activeBadge.className = 'absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800';
            activeBadge.textContent = 'Active';
            card.appendChild(activeBadge);
            
            // Here you would load the selected resume data via API
            console.log('Selected resume:', card.querySelector('h4').textContent);
        });
    });

    // Upload modal
    const uploadBtn = document.getElementById('upload-new-btn');
    const uploadModal = document.getElementById('upload-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelUpload = document.getElementById('cancel-upload');
    const confirmUpload = document.getElementById('confirm-upload');
    const fileInput = document.getElementById('resume-upload');
    
    if (uploadBtn && uploadModal) {
        [uploadBtn, closeModal, cancelUpload].forEach(el => {
            el.addEventListener('click', () => {
                uploadModal.classList.toggle('hidden');
            });
        });
        
        fileInput.addEventListener('change', () => {
            confirmUpload.disabled = !fileInput.files.length;
        });
        
        confirmUpload.addEventListener('click', async () => {
            if (fileInput.files.length) {
                // Here you would implement the actual upload logic
                const formData = new FormData();
                formData.append('resume', fileInput.files[0]);
                
                try {
                    // Example upload API call
                    const response = await fetch('/api/resumes/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        },
                        body: formData
                    });
                    
                    if (response.ok) {
                        uploadModal.classList.add('hidden');
                        // Refresh resume list
                        console.log('Upload successful');
                    } else {
                        alert('Upload failed');
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    alert('Upload error');
                }
            }
        });
    }
});
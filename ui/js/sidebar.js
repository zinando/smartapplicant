// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('aside');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }

    const logoutBtn = document.getElementById('logout-btn'); 
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                await AuthService.logout();
                // Redirect to home page after successful logout
                window.location.href = '/';
            } catch (error) {
                console.error('Logout failed:', error);
                
            }
        });
    }
});

async function logoutUser() {
    try {
        await AuthService.logout();
        // Redirect to home page after successful logout
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
        
    }
}
// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    // If not API.user.isAuthenticated(), redirect to login page
    const isAuthenticated = API.getUser().isAuthenticated;
    if (!isAuthenticated) {
        window.location.href = '/login';
    }

    // Sidebar toggle functionality
    const sidebar = document.querySelector('aside');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('sidebar-toggle');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    });

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
    toggleButtonSpinner(btnId="logout-btn", btnText="Logout", isLoading=true, loadingText='Logging you out...');
    // delay for 1 second to show the spinner
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
        await AuthService.logout();
        // Redirect to home page after successful logout
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
        toggleButtonSpinner(btnId="logout-btn", btnText="Logout", isLoading=false, loadingText='Logging you out...');
        
    }
}
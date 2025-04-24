
// Configuration
const POLL_INTERVAL = 15000; // 15 seconds
const STATS_API_URL = '/api/stats/'; // Your API endpoint

// DOM elements to update (customize these selectors as needed)
const statsElements = {
    registeredUsers: document.getElementById('registered-users-count'),
    premiumSubscribers: document.getElementById('premium-subscribers-count'),
    onlineUsers: document.getElementById('online-users-count')
    // Add more elements as needed
};

// Polling function
async function pollStats() {
    try {
        const response = await API.request(STATS_API_URL);
        
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (data.status !== 1) throw new Error(data.message);

        if (statsElements.registeredUsers) {
            statsElements.registeredUsers.textContent = data.data.registered_users;
        }
        if (statsElements.premiumSubscribers) {
            statsElements.premiumSubscribers.textContent = data.data.premium_subscribers;
        }
        if (statsElements.onlineUsers) {
            statsElements.onlineUsers.textContent = data.data.currently_online;
        }
    } catch (error) {
        console.error(error.message);
    } finally {
        setTimeout(pollStats, POLL_INTERVAL);
    }
}

// Start polling when the page loads
document.addEventListener('DOMContentLoaded', pollStats);

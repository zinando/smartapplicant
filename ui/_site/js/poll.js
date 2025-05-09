
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

/**
 * Polls a Celery task endpoint until completion
 * @param {string} taskId - The Celery task ID
 * @param {string} resultEndpoint - URL endpoint to check task status (e.g., '/api/task/result/')
 * @param {Object} options - Configuration options
 * @param {number} [options.interval=2000] - Polling interval in ms (default: 2000)
 * @param {number} [options.timeout=30000] - Total timeout in ms (default: 30000)
 * @param {function} [options.onProgress] - Callback for progress updates
 * @returns {Promise} Resolves with task result or rejects with error
 */
async function pollTaskResult(taskId, options = {}) {
    const {
        interval = 2000,
        timeout = 30000,
        onProgress = null
    } = options;

    const startTime = Date.now();
    let lastStatus = null;

    return new Promise(async (resolve, reject) => {
        const poll = async () => {
            try {
                // Check timeout
                if (Date.now() - startTime > timeout) {
                    reject(new Error('Polling timeout exceeded'));
                    return;
                }

                // Fetch task status
                const response = await API.request(`/api/task-status/${taskId}/`, 'GET');

                if (!response.ok) {
                    reject(new Error('Failed to fetch task status'));
                    return;
                }

                // Parse response
                const response_data = await response.json();

                if (response_data.status !== 1) {
                    reject(new Error(response_data.message));
                    return;
                }

                const result = response_data.data;

                // Handle different Celery task states
                if (result.status === 'SUCCESS') {
                    resolve(result.result);
                } else if (result.status === 'FAILURE') {
                    reject(new Error(result.result || 'Task failed'));
                } else if (result.status === 'REVOKED') {
                    reject(new Error('Task was revoked'));
                } else {
                    // PENDING, STARTED, RETRY, etc.
                    if (onProgress && result.status !== lastStatus) {
                        onProgress(result.status, result);
                    }
                    lastStatus = result.status;
                    setTimeout(poll, interval);
                }
            } catch (error) {
                reject(error);
            }
        };

        // Start polling
        await poll();
    });
}
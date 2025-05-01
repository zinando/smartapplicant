const ApiService = (function() {
    let instance;
    
    function createInstance(baseUrl) {
        // Initialize state from localStorage
        let accessToken = localStorage.getItem('access_token') || null;
        let refreshToken = localStorage.getItem('refresh_token') || null;
        let user = JSON.parse(localStorage.getItem('user') || "{}");
        let listeners = [];
        
        // Immediately notify listeners of initial state
        setTimeout(() => _notifyListeners(), 0);
        
        // Private methods
        function _refreshTokens() {
            return fetch(`${baseUrl}/api/auth/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken })
            })
            .then(response => {
                if (!response.ok) throw new Error('Refresh failed');
                return response.json();
            })
            .then(({ access, refresh }) => {
                _storeTokens(access, refresh);
                return access;
            });
        }
        
        function _storeTokens(access, refresh) {
            accessToken = access;
            refreshToken = refresh;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            _notifyListeners();
        }
        
        function _clearUserData() {
            accessToken = null;
            refreshToken = null;
            user = {};
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            _notifyListeners();
        }
        
        function _notifyListeners() {
            const authState = {
                user: { ...user },
                isAuthenticated: !!accessToken
            };
            
            listeners.forEach(callback => callback(authState));
        }
        
        // Public API
        return {
            initialize() {
                // Re-check storage in case of changes from other tabs
                accessToken = localStorage.getItem('access_token') || null;
                refreshToken = localStorage.getItem('refresh_token') || null;
                user = JSON.parse(localStorage.getItem('user') || '{}');
                _notifyListeners();
            },
            
            request: async function request(url, method = 'GET', data = null, isFormData = false) {
                const config = {
                    method,
                    headers: {}
                };
            
                // Don't set Content-Type for FormData - the browser will set it automatically
                if (!isFormData) {
                    config.headers['Content-Type'] = 'application/json';
                }
            
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
            
                // Handle both JSON and FormData
                if (data) {
                    config.body = isFormData ? data : JSON.stringify(data);
                }
            
                let response = await fetch(`${baseUrl}${url}`, config);
            
                // Token refresh logic remains the same
                if (response.status === 401 && refreshToken) {
                    try {
                        const newToken = await _refreshTokens();
                        config.headers.Authorization = `Bearer ${newToken}`;
                        response = await fetch(`${baseUrl}${url}`, config);
                    } catch (error) {
                        _clearUserData();
                        throw error;
                    }
                }
            
                if (response.status === 401) {
                    _clearUserData();
                }
            
                return response;
            },
            
            login: function(data) {
                _storeTokens(data.access, data.refresh);
                this.setUser(data.user);
            },
            
            logout: function() {
                _clearUserData();
            },
            
            setUser: function(userData) {
                user = { ...userData };
                localStorage.setItem('user', JSON.stringify(user));
                _notifyListeners();
            },
            
            getUser: function() {
                return { ...user, isAuthenticated: !!accessToken };
            },
            
            addAuthListener: function(callback) {
                listeners.push(callback);
                // Return unsubscribe function
                return () => {
                    listeners = listeners.filter(cb => cb !== callback);
                };
            },
            
            isAuthenticated: function() {
                return !!accessToken;
            }
        };
    }
    
    return {
        getInstance: function(baseUrl) {
            if (!instance) {
                instance = createInstance(baseUrl);
            } else {
                instance.initialize(); // Refresh state on subsequent calls
            }
            return instance;
        }
    };
})();

// Initialize and setup cross-tab sync
const API = ApiService.getInstance('http://146.19.133.88:8000');
// const API = ApiService.getInstance('https://smartapplicant-backend-c4f2.onrender.com');
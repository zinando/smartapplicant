// Singleton API service
const ApiService = (function() {
    let instance;
    
    function createInstance(baseUrl) {
      let accessToken = localStorage.getItem('access_token');
      let refreshToken = localStorage.getItem('refresh_token');
      let user = {};
      
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
        user = { isAuthenticated: true }; // Assuming user is authenticated after token refresh
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
      }
      
      function _clearTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        accessToken = null;
        refreshToken = null;
        user = {};
      }
      
      // Public API
      return {
        request: async function(url, method = 'GET', data = null) {
          const config = {
            method,
            headers: { 'Content-Type': 'application/json' }
          };
          
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          if (data) config.body = JSON.stringify(data);
          
          let response = await fetch(`${baseUrl}${url}`, config);
          
          // Handle token refresh
          if (response.status === 401 && refreshToken) {
            const newToken = await _refreshTokens();
            config.headers.Authorization = `Bearer ${newToken}`;
            response = await fetch(`${baseUrl}${url}`, config);
          }
          return response;
        },
        logout: function() {
          _clearTokens();
        },
        loginUser: function(authUser){
          user = authUser;
          user.isAuthenticated = true;
        },
        user: function() {
          return user;
        },
      };
    }
    
    return {
      getInstance: function(baseUrl) {
        if (!instance) {
          instance = createInstance(baseUrl);
        }
        return instance;
      }
    };
  })();
  
  // Initialize
  const API = ApiService.getInstance('http://127.0.0.1:8000');
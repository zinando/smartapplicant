// Uses the API singleton
const AuthService = {
    login: function(data) {
      return API.request('/api/auth/login/', 'POST', data);
    },
    
    signup: function(data) {
      return API.request('/api/auth/signup/', 'POST', data);
    },
    
    logout: function() {
      return API.request('/api/auth/logout/', 'POST', { 
        refresh: localStorage.getItem('refresh_token') 
      }).finally(() => {
        API.logout();
      });
    }
  }; 
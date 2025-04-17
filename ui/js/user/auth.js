// Uses the API singleton
const AuthService = {
    login: function(email, password) {
      return API.request('/api/auth/login/', 'POST', { email, password });
    },
    
    signup: function(email, password) {
      return API.request('/api/auth/signup/', 'POST', { email, password });
    },
    
    logout: function() {
      return API.request('/api/auth/logout/', 'POST', { 
        refresh: localStorage.getItem('refresh_token') 
      }).finally(() => {
        API.logout();
      });
    }
  };
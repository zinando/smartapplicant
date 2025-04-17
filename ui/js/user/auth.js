// Uses the API singleton
const AuthService = {

    login: function(data) {
      const response = API.request('/api/auth/login/', 'POST', data);
      return response;
    },
    
    signup: function(data) {
      const response = API.request('/api/auth/signup/', 'POST', data);
      return response;
    },
    
    logout: function() {
      return API.request('/api/auth/logout/', 'POST', { 
        refresh: localStorage.getItem('refresh_token') 
      }).finally(() => {
        API.logout();
      });
    }
  }; 
const API_URL = 'http://localhost:9000/api/auth';

const request = async (url, method, body = null, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
  
    const config = {
      method,
      headers,
    };

    if(token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    if (body) {
      config.body = JSON.stringify(body);
    }
  
    try {
      const response = await fetch(`${API_URL}${url}`, config);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      return data;
    } 
    catch (error) {
      throw new Error(error.message);
    }
  };
  
  // Signup
  export const signup = async (userData) => {
    return request('/signup', 'POST', userData);
  };
  
  // Login 
  export const login = async (credentials) => {
    return request('/login', 'POST', credentials);
  };

  //Fetch user data
  export const getUserData = async (token) => {
    return request("/user", "GET", null, token);
  };
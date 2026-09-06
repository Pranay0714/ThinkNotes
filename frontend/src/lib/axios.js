import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Add JWT token to every API request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // If response is successful, return normally
    return response;
  },
  (error) => {
    // If token is expired or invalid
    if (error.response?.status === 401) {
      // Remove authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect user to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
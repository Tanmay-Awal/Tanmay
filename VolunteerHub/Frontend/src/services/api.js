  // ✅ src/services/api.js

  import axios from "axios";
  import { refreshToken } from "./authService";

  // ✅ Create Axios instance
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // ✅ Attach short-lived access_token automatically for every request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  let sessionExpired = false;

  // ✅ Handle 401 automatically by calling refreshToken() and retrying once
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      // Do NOT attempt refresh for login or register endpoints
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/login') &&
        !originalRequest.url.includes('/auth/register')
      ) {
        originalRequest._retry = true;
        try {
          const data = await refreshToken();
          localStorage.setItem("access_token", data.access_token);
          originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_email");
          localStorage.removeItem("auth_role");
          if (!sessionExpired) {
            sessionExpired = true;
            window.alert("Session expired. Please log in again.");
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  export default api;

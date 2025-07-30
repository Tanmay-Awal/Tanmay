import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

export const googleAuthService = {
  googleLogin: async (idToken) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/google/login`,
        {
          idToken: idToken,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Google login failed" };
    }
  },

  googleSignup: async (idToken, role) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/google/signup`,
        {
          idToken: idToken,
          role: role,
        }
      );
      const data = response.data;
      if (data && data.data) {
        localStorage.setItem("user_email", data.data.email);
        localStorage.setItem("user_id", data.data.id);
        localStorage.setItem("auth_role", data.data.role);
        localStorage.setItem("is_google_user", "true");
        if (data.access_token)
          localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token)
          localStorage.setItem("refresh_token", data.refresh_token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Google signup failed" };
    }
  },
};
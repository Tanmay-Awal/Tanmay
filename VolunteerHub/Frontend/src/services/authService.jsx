
import api from "./api";

export async function loginUser({ email, password, role }) {
  try {
    const res = await api.post("/auth/login", { email, password, role });

    if (res.data.access_token) {
      localStorage.setItem("access_token", res.data.access_token);
    }
    if (res.data.refresh_token) {
      localStorage.setItem("refresh_token", res.data.refresh_token);
    }

    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 400) {
        // Handle validation errors
        if (data.message) {
          return { success: false, message: data.message };
        }
      } else if (status === 401) {
        return { success: false, message: 'Incorrect password' };
      } else if (status === 404) {
        return { success: false, message: 'User not found' };
      } else if (status === 500) {
        return { success: false, message: 'Server error. Please try again later.' };
      }
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
    
    // Default error
    return { success: false, message: error.message || 'Login failed. Please try again.' };
  }
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");
  const res = await api.post(
    "/auth/refresh",
    {},
    {
      headers: {
        Authorization: `Bearer ${refresh_token}`,
      },
    }
  );
  return res.data;
}

export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_email");
  localStorage.removeItem("auth_role");
  localStorage.removeItem("is_google_user");
  localStorage.removeItem("access_token_ngo");
  return api.post("/auth/logout");
}


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
    if (error.response && error.response.data && error.response.data.message) {
      return { success: false, message: error.response.data.message };
    }
    return { success: false, message: error.message || 'Login failed' };
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

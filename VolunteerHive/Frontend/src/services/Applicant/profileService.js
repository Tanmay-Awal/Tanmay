
import api from "../api";

export async function getProfile() {
  const res = await api.get("/user/profile");
  return res.data;
}

export async function updateBasicProfile(payload) {
  const res = await api.put("/user/profile", payload);
  return res.data;
}

export async function updateProfileDetails(payload) {
  const res = await api.put("/user/profile/details", payload);
  return res.data;
}

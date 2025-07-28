
import api from "../api";

export async function getNgoProfile() {
  const res = await api.get("/ngo/profile");
  return res.data;
}

export async function updateNgoProfile(payload) {
  const res = await api.put("/ngo/profile", payload);
  return res.data; 
}

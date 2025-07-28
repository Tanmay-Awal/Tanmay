import api from "./api";

export async function registerUser({ email, password, role }) {
  const payload = {
    email: email.trim().toLowerCase(),
    password,
    role,
  };
  console.log("registerUser payload:", payload);

  const response = await api.post("/auth/register", payload);
  console.log("registerUser response:", response.data);
  return response.data;
}

export async function saveNgoDetails(ngoData) {
  const response = await api.post("/ngo/details", ngoData);
  console.log("saveNgoDetails response:", response.data);
  return response.data;
}

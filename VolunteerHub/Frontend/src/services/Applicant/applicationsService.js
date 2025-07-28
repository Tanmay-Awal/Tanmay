import api from "../api";

export async function fetchMyApplications(email) {
  const response = await api.get("/applications", {
    params: { email },
  });
  console.log("fetchMyApplications response:", response.data);
  return response.data;
}

export async function createApplication(data) {
  const response = await api.post("/applications", data);
  console.log("createApplication response:", response.data);
  return response.data;
}

export async function deleteApplication(applicationId) {
  const response = await api.delete(`/applications/${applicationId}`);
  console.log("deleteApplication response:", response.data);
  return response.data;
}

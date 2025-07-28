import api from "../api";

export async function getApplications() {
  const res = await api.get("/ngo/applications");
  return res.data;
}

export async function updateApplicationStatus(appId, status) {
  const res = await api.put(`/ngo/applications/${appId}/status`, { status });
  return res.data;
}

export async function getVolunteerProfile(volunteerId) {
  const response = await fetch(
    `http://localhost:5000/api/admin/volunteer-profile/${volunteerId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

  const data = await response.json();
  console.log("✅ Volunteer profile fetched:", data);
  return data;
}



export async function getSingleApplication(appId) {
  const res = await api.get(`/ngo/applications/${appId}`);
  return res.data;
}

export async function deleteApplication(appId) {
  const res = await api.delete(`/ngo/applications/${appId}`);
  return res.data;
}


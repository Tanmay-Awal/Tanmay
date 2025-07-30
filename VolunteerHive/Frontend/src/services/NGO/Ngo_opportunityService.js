
import api from "../api";

export async function getOpportunities() {
  const res = await api.get("/ngo/opportunities");
  return res.data;
}

export async function createOpportunity(formData) {
  const res = await api.post("/ngo/opportunities", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateOpportunity(id, formData) {
  const res = await api.put(`/ngo/opportunities/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getSingleOpportunity(id) {
  const res = await api.get(`/ngo/opportunities/${id}`);
  return res.data;
}


export async function deleteOpportunity(id) {
  const res = await api.delete(`/ngo/opportunities/${id}`);
  return res.data;
}

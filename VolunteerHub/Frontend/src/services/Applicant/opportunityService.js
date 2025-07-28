import api from "../api";
import axios from "axios";

export async function fetchOpportunities() {
  const response = await api.get("/opportunities");
  return response.data;
}

export async function applyForOpportunity(data) {
  const response = await api.post("/applications", data);
  return response.data;
}

export const getSingleOpportunity = (id) => {
  return axios.get(`http://localhost:5000/api/opportunities/${id}`);
};

export async function checkProfileComplete() {
  const response = await api.get("/profile/check-complete");
  return response.data;
}

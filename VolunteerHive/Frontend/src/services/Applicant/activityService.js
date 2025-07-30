import api from "../api";

export async function fetchMyActivity() {
  const response = await api.get("/activity/my-activity");
  return response.data;
}

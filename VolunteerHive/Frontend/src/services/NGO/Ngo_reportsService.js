
import api from "../api";

export async function getNGOReports() {
  const res = await api.get("/ngo/reports");
  return res.data; 
}

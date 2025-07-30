import api from "../api";

export async function getTasks(email) {
  const res = await api.get(`/tasks?email=${encodeURIComponent(email)}`);
  return res.data;
}

export async function startTask(taskId) {
  await api.put(`/tasks/${taskId}/start`);
}

export async function completeTask(taskId) {
  await api.put(`/tasks/${taskId}/complete`);
}

export const getSingleTask = (id) => api.get(`/tasks/${id}`);


export async function deleteTask(taskId) {
  return await api.delete(`/tasks/${taskId}`);
}

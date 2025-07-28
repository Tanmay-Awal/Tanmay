import api from "../api";

export const getNotifications = async (userId) => {
  const response = await api.get(`/notifications/${userId}`);
  return response.data;
};

export const markNotificationRead = async (notifId) => {
  const response = await api.put(`/notifications/${notifId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async (userId) => {
  const response = await api.put(`/notifications/mark_all_read/${userId}`);
  return response.data;
};

export async function deleteNotification(notifId) {
  const res = await api.delete(`/notifications/${notifId}`);
  return res.data;
}

export async function deleteNotificationFromServer(id) {
  return await api.delete(`/notifications/${id}`);
}


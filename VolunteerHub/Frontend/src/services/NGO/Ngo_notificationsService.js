import api from "../api";

export async function getNgoNotifications() {
  const ngoToken = localStorage.getItem("access_token_ngo");
  const res = await api.get("/ngo/notifications", {
    headers: {
      Authorization: `Bearer ${ngoToken}`,
    },
  });
  return res.data;
}

export async function markNotificationRead(notifId) {
  const ngoToken = localStorage.getItem("access_token_ngo");
  const res = await api.put(`/ngo/notifications/${notifId}/read`, {}, {
    headers: {
      Authorization: `Bearer ${ngoToken}`,
    },
  });
  return res.data;
}

export async function markAllNotificationsRead() {
  const ngoToken = localStorage.getItem("access_token_ngo");
  const res = await api.put("/ngo/notifications/mark_all_read", {}, {
    headers: {
      Authorization: `Bearer ${ngoToken}`,
    },
  });
  return res.data;
}


export async function deleteNgoNotification(notifId) {
  const ngoToken = localStorage.getItem("access_token_ngo");
  const res = await api.delete(`/ngo/notifications/${notifId}`, {
    headers: {
      Authorization: `Bearer ${ngoToken}`,
    },
  });
  return res.data;
}


import api from "../api";

export async function getSettingsProfile() {
  const res = await api.get("/ngo/settings/profile");
  return res.data;
}

export async function updateEmail(newEmail) {
  const res = await api.put("/ngo/settings/email", { newEmail });
  return res.data;
}

export async function updatePassword(passwordData) {
  const res = await api.put("/ngo/settings/password", passwordData);
  return res.data;
}

export async function deleteNgoAccount(confirmation) {
  const res = await api.delete("/ngo/settings/delete-account", {
    data: { confirmation },
  });
  return res.data;
}



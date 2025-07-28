import api from "../api";

export async function deleteAccount(email) {
  const payload = { email };
  const response = await api.delete("/settings/delete-account", {
    data: payload,
  });
  return response.data;
}

export async function updateEmail(newEmail) {
  const response = await api.put("/user/update-email", { newEmail });
  return response.data;
}

export const updatePassword = async ({ oldPassword, newPassword }) => {
  const res = await api.put('/user/update-password', {
    oldPassword,
    newPassword
  });
  return res.data;
};

import api from '../api';

export const fetchNgoTasks = async () => {
  try {
    const response = await api.get('/ngo/tasks');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch NGO tasks:', error);
    throw error;
  }
};

export const deleteNgoTask = async (taskId) => {
  try {
    console.log("🚀 Attempting to delete task:", taskId);
    const response = await api.delete(`/ngo/tasks/${taskId}`);
    console.log("✅ Delete successful:", response.data);
    return { ...response.data, id: taskId };
  } catch (error) {
    console.error("❌ Delete failed:", error.response?.data || error.message);
    throw error;
  }
};



export const fetchNgoTaskById = async (id) => {
  const response = await api.get(`/ngo/tasks/${id}`);
  return response.data;
};

export const verifyNgoTaskStatus = async (taskId, action, message, impactScore) => {
  console.log("🚀 Sending to backend:", {
    action,
    message,
    impactScore,
  });

  const response = await api.put(`/ngo/tasks/${taskId}/verify`, {
    action,
    message,
    impactScore,
  });

  return {
    ...response.data,
    taskId,
    action,
    impactScore,
  };
};


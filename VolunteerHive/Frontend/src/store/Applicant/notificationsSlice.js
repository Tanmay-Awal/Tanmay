
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../../services/Applicant/notificationsService";
import { deleteNotificationFromServer } from "../../services/Applicant/notificationsService";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const result = await getNotifications(userId);
      return result.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notifId, { rejectWithValue }) => {
    try {
      await markNotificationRead(notifId);
      return notifId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (userId, { rejectWithValue }) => {
    try {
      await markAllNotificationsRead(userId);
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteVolunteerNotification = createAsyncThunk(
  "notifications/deleteVolunteerNotification",
  async (id, { rejectWithValue }) => {
    try {
      await deleteNotificationFromServer(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  notifications: [],
  isLoading: false,
  error: "",
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notifId = action.payload;
        const index = state.notifications.findIndex((n) => n.id === notifId);
        if (index !== -1) state.notifications[index].read = true;
      })
      .addCase(deleteVolunteerNotification.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.notifications = state.notifications.filter(n => n.id !== deletedId);
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));
      });
  },
});

export const notificationsSelectors = {
  getNotifications: (state) => state.notifications.notifications,
  getLoading: (state) => state.notifications.isLoading,
  getError: (state) => state.notifications.error,
};

export default notificationsSlice.reducer;

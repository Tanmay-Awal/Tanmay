
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNgoNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/NGO/Ngo_notificationsService";

import { deleteNgoNotification } from "../../services/NGO/Ngo_notificationsService";


export const fetchNgoNotifications = createAsyncThunk(
  "ngoNotifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getNgoNotifications();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNgoNotifRead = createAsyncThunk(
  "ngoNotifications/markSingle",
  async (notifId, { rejectWithValue }) => {
    try {
      return await markNotificationRead(notifId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNgoAllNotifRead = createAsyncThunk(
  "ngoNotifications/markAll",
  async (_, { rejectWithValue }) => {
    try {
      return await markAllNotificationsRead();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteNgoNotificationThunk = createAsyncThunk(
  "ngoNotifications/delete",
  async (notifId, { rejectWithValue }) => {
    try {
      await deleteNgoNotification(notifId);
      return notifId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



const ngoNotificationsSlice = createSlice({
  name: "ngoNotifications",
  initialState: {
    list: [],
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNgoNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchNgoNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchNgoNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(markNgoNotifRead.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(markNgoAllNotifRead.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteNgoNotificationThunk.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.list = state.list.filter(n => n.id !== deletedId);
        state.isLoading = false;
      });
  },
});

export default ngoNotificationsSlice.reducer;

export const ngoNotificationsSelectors = {
  getList: (state) => state.ngoNotifications.list,
  getIsLoading: (state) => state.ngoNotifications.isLoading,
  getError: (state) => state.ngoNotifications.error,
};

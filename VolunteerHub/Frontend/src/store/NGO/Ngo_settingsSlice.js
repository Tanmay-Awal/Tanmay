

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSettingsProfile,
  updateEmail,
  updatePassword,
  deleteNgoAccount,
} from "../../services/NGO/Ngo_settingsService";

export const fetchSettingsProfile = createAsyncThunk(
  "ngoSettings/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getSettingsProfile();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const submitEmailUpdate = createAsyncThunk(
  "ngoSettings/updateEmail",
  async (newEmail, { rejectWithValue }) => {
    try {
      return await updateEmail(newEmail);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const submitPasswordUpdate = createAsyncThunk(
  "ngoSettings/updatePassword",
  async (newPassword, { rejectWithValue }) => {
    try {
      return await updatePassword(newPassword);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const submitAccountDelete = createAsyncThunk(
  "ngoSettings/deleteAccount",
  async (confirmation, { rejectWithValue }) => {
    try {
      return await deleteNgoAccount(confirmation);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



const ngoSettingsSlice = createSlice({
  name: "ngoSettings",
  initialState: {
    profile: {},
    isLoading: false,
    error: "",
  },
  reducers: {},


extraReducers: (builder) => {
  builder
    .addCase(fetchSettingsProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchSettingsProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profile = action.payload.data;
    })
    .addCase(fetchSettingsProfile.rejected, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.error = action.payload.message;
      } else {
        state.error = action.error.message;
      }
    })

    .addMatcher(
      (action) => action.type.startsWith('ngoSettings/') && action.type.endsWith('/pending'),
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    )
    .addMatcher(
      (action) => action.type.startsWith('ngoSettings/') && action.type.endsWith('/fulfilled'),
      (state) => {
        state.isLoading = false;
      }
    )
    .addMatcher(
      (action) => action.type.startsWith('ngoSettings/') && action.type.endsWith('/rejected'),
      (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      }
    );
},
});

export default ngoSettingsSlice.reducer;

export const ngoSettingsSelectors = {
  getProfile: (state) => state.ngoSettings.profile,
  getIsLoading: (state) => state.ngoSettings.isLoading,
  getError: (state) => state.ngoSettings.error,
};

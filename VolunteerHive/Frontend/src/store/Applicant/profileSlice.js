// src/store/profileSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, updateBasicProfile, updateProfileDetails } from '../../services/Applicant/profileService';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await getProfile();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitBasicProfile = createAsyncThunk(
  'profile/submitBasicProfile',
  async (payload, { rejectWithValue }) => {
    try {
      return await updateBasicProfile(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitProfileDetails = createAsyncThunk(
  'profile/submitProfileDetails',
  async (payload, { rejectWithValue }) => {
    try {
      return await updateProfileDetails(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  profileForm: {
    email: '',
    name: '',
    phone: '',
    skills: [],
    bio: '',
    pastExperience: '',
  },
  isLoading: false,
  errors: {
    general: '',
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileField(state, action) {
      const { field, value } = action.payload;
      state.profileForm[field] = value;
    },
    clearProfileForm(state) {
      state.profileForm = {
        email: '',
        name: '',
        phone: '',
        skills: [],
        bio: '',
        pastExperience: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileForm = { ...state.profileForm, ...action.payload.data };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.errors.general = action.payload;
      })
      .addCase(submitBasicProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitBasicProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileForm = { ...state.profileForm, ...action.payload.data };
      })  
      .addCase(submitProfileDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitProfileDetails.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(submitProfileDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.errors.general = action.payload;
      });
  },
});

export const profileActions = profileSlice.actions;

export const profileSelectors = {
  getProfileForm: (state) => state.profile.profileForm,
  getIsLoading: (state) => state.profile.isLoading,
  getProfileErrors: (state) => state.profile.errors,
};

export default profileSlice.reducer;

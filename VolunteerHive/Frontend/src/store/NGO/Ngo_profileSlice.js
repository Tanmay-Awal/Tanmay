
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNgoProfile, updateNgoProfile } from "../../services/NGO/Ngo_profileService";

export const fetchNgoProfile = createAsyncThunk(
  "ngoProfile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getNgoProfile();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitNgoProfile = createAsyncThunk(
  "ngoProfile/submit",
  async (payload, { rejectWithValue }) => {
    try {
      await updateNgoProfile(payload);
      return payload;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ngoProfileSlice = createSlice({
  name: "ngoProfile",
  initialState: {
    form: {
      organizationName: "",
      contactPersonName: "",
      contactEmail: "",
      contactPhone: "",
      headOfficeAddress: "",
      operatingRegions: "",
      googleMapsLink: "",
      missionStatement: "",
      website: "",
      facebook: "",
      instagram: "",
      linkedin: ""
    },
    isLoading: false,
    error: ""
  },
  reducers: {
    updateNgoProfileField(state, action) {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    clearNgoProfileForm(state) {
      state.form = {
        organizationName: "",
        contactPersonName: "",
        contactEmail: "",
        contactPhone: "",
        headOfficeAddress: "",
        operatingRegions: "",
        googleMapsLink: "",
        missionStatement: "",
        website: "",
        facebook: "",
        instagram: "",
        linkedin: ""
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNgoProfile.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchNgoProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.form = action.payload.data;
      })
      .addCase(fetchNgoProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitNgoProfile.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(submitNgoProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.form = {
          ...state.form,
          ...action.payload,
        };
      })
      .addCase(submitNgoProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const ngoProfileActions = ngoProfileSlice.actions;

export const ngoProfileSelectors = {
  getForm: (state) => state.ngoProfile.form,
  getIsLoading: (state) => state.ngoProfile.isLoading,
  getError: (state) => state.ngoProfile.error
};

export default ngoProfileSlice.reducer;

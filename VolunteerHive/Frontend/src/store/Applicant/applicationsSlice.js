import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMyApplications, createApplication as createApplicationService } from "../../services/Applicant/applicationsService";
import { deleteApplication as deleteApplicationService } from "../../services/Applicant/applicationsService";


// 👉 Thunk: Get user’s applications
export const getMyApplications = createAsyncThunk(
  "applications/getMyApplications",
  async (email, { rejectWithValue }) => {
    try {
      const result = await fetchMyApplications(email);
      return result.applications;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load applications.");
    }
  }
);

// 👉 Thunk: Create a new application
export const createApplication = createAsyncThunk(
  "applications/createApplication",
  async (applicationData, { rejectWithValue, dispatch }) => {
    try {
      const result = await createApplicationService(applicationData);
      
      // ✅ Refresh applications list after successful creation
      if (applicationData.volunteerEmail) {
        await dispatch(getMyApplications(applicationData.volunteerEmail));
      }
      
      return result;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create application.");
    }
  }
);


export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",
  async (applicationId, { rejectWithValue }) => {
    try {
      const result = await deleteApplicationService(applicationId);
      return { id: applicationId, ...result };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete application.");
    }
  }
);


const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    list: [],
    isLoading: false,
    error: "",
    applyLoading: false,  // ✅ For APPLY button spinner
  },
  reducers: {
    clearApplications(state) {
      state.list = [];
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Get My Applications
      .addCase(getMyApplications.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload || [];
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.applyLoading = true;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.applyLoading = false;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.applyLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.list = state.list.filter((app) => app.id !== action.payload.id);
      });
  },
});

export const applicationsActions = applicationsSlice.actions;

export const applicationsSelectors = {
  getApplicationsList: (state) => state.applications.list,
  getIsLoading: (state) => state.applications.isLoading,
  getApplicationsError: (state) => state.applications.error,
  getApplyLoading: (state) => state.applications.applyLoading, // ✅
};

export default applicationsSlice.reducer;

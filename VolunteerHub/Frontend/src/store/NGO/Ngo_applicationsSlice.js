
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApplications, updateApplicationStatus } from "../../services/NGO/Ngo_applicationsService";
import { getVolunteerProfile } from "../../services/NGO/Ngo_applicationsService";
import { getSingleApplication , deleteApplication as deleteApplicationApi,} from "../../services/NGO/Ngo_applicationsService";


export const fetchSingleApplication = createAsyncThunk(
  "ngoApplications/fetchSingleApplication",
  async (appId, { rejectWithValue }) => {
    try {
      return await getSingleApplication(appId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchVolunteerProfile = createAsyncThunk(
  "ngoApplications/fetchVolunteerProfile",
  async (volunteerId, { rejectWithValue }) => {
    try {
      return await getVolunteerProfile(volunteerId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchApplications = createAsyncThunk(
  "ngoApplications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getApplications();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changeApplicationStatus = createAsyncThunk(
  "ngoApplications/changeStatus",
  async ({ appId, status }, { rejectWithValue }) => {
    try {
      console.log("🚀 Calling updateApplicationStatus with:", { appId, status });
      const result = await updateApplicationStatus(appId, status);
      console.log("✅ updateApplicationStatus result:", result);
      return result;
    } catch (err) {
      console.error("❌ updateApplicationStatus error:", err);
      return rejectWithValue(err.message);
    }
  }
);

export const deleteApplication = createAsyncThunk(
  "ngoApplications/deleteApplication",
  async (appId, { rejectWithValue }) => {
    try {
      return await deleteApplicationApi(appId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ngoApplicationsSlice = createSlice({
  name: "ngoApplications",
  initialState: {
    list: [],
    singleApplication: {}, 
    volunteerProfile: {},
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchVolunteerProfile.fulfilled, (state, action) => {
        state.volunteerProfile = action.payload.data;
      })
      .addCase(fetchSingleApplication.fulfilled, (state, action) => {
        state.singleApplication = action.payload.data;
      })
      .addCase(changeApplicationStatus.fulfilled, (state, action) => {
        const { appId, status } = action.meta.arg;
        const index = state.list.findIndex(app => app.id === appId);
        if (index !== -1) {
          state.list[index].status = status.toLowerCase();
        }
        state.isLoading = false;
      })

  },
});

export default ngoApplicationsSlice.reducer;

export const ngoApplicationsSelectors = {
  getVolunteerProfile: (state) => state.ngoApplications.volunteerProfile,
  getSingleApplication: (state) => state.ngoApplications.singleApplication,
  getList: (state) => state.ngoApplications.list,
  getIsLoading: (state) => state.ngoApplications.isLoading,
  getError: (state) => state.ngoApplications.error,
};

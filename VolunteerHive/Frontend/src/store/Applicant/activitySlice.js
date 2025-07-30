import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMyActivity } from "../../services/Applicant/activityService";

export const getMyActivity = createAsyncThunk(
  "activity/getMyActivity",
  async (_, { rejectWithValue }) => {
    try {
      const result = await fetchMyActivity();
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.message || "Failed to load activity");
      }
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    stats: {
      tasksCompleted: 0,
      eventsAttended: 0,
      ngosHelped: 0,
      impactScore: 0
    },
    isLoading: false,
    error: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyActivity.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getMyActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(getMyActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default activitySlice.reducer;

export const activitySelectors = {
  getStats: (state) => state.activity.stats,
  getIsLoading: (state) => state.activity.isLoading,
  getError: (state) => state.activity.error,
};

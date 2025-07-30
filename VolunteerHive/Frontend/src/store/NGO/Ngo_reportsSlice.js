// src/store/NGO/Ngo_reportsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNGOReports } from "../../services/NGO/Ngo_reportsService";

export const fetchNGOReports = createAsyncThunk(
  "ngoReports/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getNGOReports();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ngoReportsSlice = createSlice({
  name: "ngoReports",
  initialState: {
    stats: {
      totalOpportunities: 0,
      totalApplications: 0,
      totalVolunteers: 0,
      totalTasksCompleted: 0,
    },
    isLoading: false,
    error: "",
  },
  reducers: {
    refreshReports: (state) => {
      state.isLoading = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNGOReports.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchNGOReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data.stats || state.stats;
      })
      .addCase(fetchNGOReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { refreshReports } = ngoReportsSlice.actions;
export default ngoReportsSlice.reducer;

export const ngoReportsSelectors = {
  getStats: (state) => state.ngoReports.stats,
  getIsLoading: (state) => state.ngoReports.isLoading,
  getError: (state) => state.ngoReports.error,
};
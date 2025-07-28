// src/store/opportunitiesSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOpportunities, applyForOpportunity } from "../../services/Applicant/opportunityService";

export const getOpportunities = createAsyncThunk(
  "opportunities/getOpportunities",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOpportunities();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitApplication = createAsyncThunk(
  "opportunities/submitApplication",
  async (data, { rejectWithValue }) => {
    try {
      return await applyForOpportunity(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const opportunitiesSlice = createSlice({
  name: "opportunities",
  initialState: {
    opportunities: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOpportunities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOpportunities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.opportunities = action.payload;
      })
      .addCase(getOpportunities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const opportunitiesSelectors = {
  getOpportunities: (state) => state.opportunities.opportunities,
  getIsLoading: (state) => state.opportunities.isLoading,
  getError: (state) => state.opportunities.error,
};

export default opportunitiesSlice.reducer;

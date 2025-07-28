
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getSingleOpportunity,
} from "../../services/NGO/Ngo_opportunityService";

export const fetchOpportunities = createAsyncThunk(
  "ngoOpportunities/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getOpportunities();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addOpportunity = createAsyncThunk(
  "ngoOpportunities/add",
  async (formData, { rejectWithValue }) => {
    try {
      return await createOpportunity(formData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const editOpportunity = createAsyncThunk(
  "ngoOpportunities/edit",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await updateOpportunity(id, formData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const removeOpportunity = createAsyncThunk(
  "ngoOpportunities/remove",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteOpportunity(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchSingleOpportunity = createAsyncThunk(
  "ngoOpportunities/fetchSingle",
  async (id, { rejectWithValue }) => {
    try {
      return await getSingleOpportunity(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



const ngoOpportunitySlice = createSlice({
  name: "ngoOpportunities",
  initialState: {
    list: [],
    single: {},
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunities.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleOpportunity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.single = action.payload.data;
      })  
      .addCase(addOpportunity.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editOpportunity.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeOpportunity.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.meta.arg;
        state.list = state.list.filter(opp => opp.id !== deletedId);
      });
  },
});

export default ngoOpportunitySlice.reducer;

export const ngoOpportunitySelectors = {
  getList: (state) => state.ngo_opportunities.list,
  getSingle: (state) => state.ngo_opportunities.single,
  getIsLoading: (state) => state.ngo_opportunities.isLoading,
  getError: (state) => state.ngo_opportunities.error,
};


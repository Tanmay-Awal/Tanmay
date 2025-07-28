import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteAccount, updateEmail, updatePassword } from "../../services/Applicant/settingsService";


export const submitDeleteAccount = createAsyncThunk(
  "settings/submitDeleteAccount",
  async ({ email, navigate }, { rejectWithValue }) => {
    try {
      const result = await deleteAccount(email);
      if (result.success) {
        navigate("/");
        return result;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong.");
    }
  }
);

export const submitEmailUpdate = createAsyncThunk(
  "settings/submitEmailUpdate",
  async ({ newEmail, navigate }, { rejectWithValue }) => {
    try {
      const result = await updateEmail(newEmail);
      if (result.success) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_email");
        navigate("/login");
        return result;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong.");
    }
  }
);

export const submitPasswordUpdate = createAsyncThunk(
  "settings/submitPasswordUpdate",
  async (passwordData, { rejectWithValue }) => {
    try {
      const result = await updatePassword(passwordData);
      if (result.success) {
        return result;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

    
const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    isLoading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitDeleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(submitDeleteAccount.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(submitDeleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(submitEmailUpdate.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(submitEmailUpdate.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(submitEmailUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(submitPasswordUpdate.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(submitPasswordUpdate.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(submitPasswordUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const settingsSelectors = {
  getIsLoading: (state) => state.settings.isLoading,
  getError: (state) => state.settings.error,
};

export default settingsSlice.reducer;

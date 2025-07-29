
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../services/authService";

export const submitLogin = createAsyncThunk(
  "auth/submitLogin",
  async ({ formData, navigate }, { rejectWithValue }) => {
    try {
      const result = await loginUser(formData);

      if (result.success) {
        const role = result.data.role;

        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user_id", result.data.id);
        localStorage.setItem("user_email", result.data.email);
        localStorage.setItem("auth_role", result.data.role);
        localStorage.removeItem("is_google_user"); 
        
        if (role === "admin") {
          localStorage.setItem("access_token_ngo", result.access_token);
          navigate("/ngo-dashboard");
        } else if (role === "user") {
          navigate("/volunteer-dashboard");
        } else {
          navigate("/");
        }

        
        console.log("🔍 Login - Setting localStorage user_email:", result.data.email);
        console.log("🔍 Login - Full result data:", result.data);

        return result;
      } else {
        return rejectWithValue(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.message) {
        if (err.message.toLowerCase().includes('incorrect password') || 
            err.message.toLowerCase().includes('password')) {
          return rejectWithValue({ 
            type: 'password', 
            message: err.message 
          });
        }
        
        if (err.message.toLowerCase().includes('user not found') || 
            err.message.toLowerCase().includes('email')) {
          return rejectWithValue({ 
            type: 'email', 
            message: err.message 
          });
        }
        
        return rejectWithValue({ 
          type: 'general', 
          message: err.message 
        });
      }
      
      return rejectWithValue({ 
        type: 'general', 
        message: 'Something went wrong. Please try again.' 
      });
    }
  }
);

const initialState = {
  user: {
    email: localStorage.getItem("user_email") || "",
    role: localStorage.getItem("auth_role") || "",
  },
  loginForm: {
    email: "",
    password: "",
    role: "",
  },
  isLoading: false,
  showPassword: false,
  errors: {
    email: "",
    password: "",
    role: "",
    general: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateLoginField(state, action) {
      const { field, value } = action.payload;
      state.loginForm[field] = value;
    },
    clearLoginError(state, action) {
      state.errors[action.payload] = "";
    },
    togglePasswordVisibility(state) {
      state.showPassword = !state.showPassword;
    },
    clearLoginForm(state) {
      state.loginForm = { email: "", password: "", role: "" };
    },
    logout(state) {
      state.user = { email: "" };
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
      localStorage.removeItem("auth_role");
      localStorage.removeItem("is_google_user");
      localStorage.removeItem("access_token_ngo");
    },
    updateUserInfo(state, action) {
      state.user = {
        email: action.payload.email,
        role: action.payload.role
      };
    },
    setLoginError(state, action) {
      const { field, message } = action.payload;
      state.errors[field] = message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLogin.pending, (state) => {
        state.isLoading = true;
        state.errors.general = "";
      })
      .addCase(submitLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loginForm = { email: "", password: "", role: "" };
        state.user = {
          email: action.payload.data.email,
          role: action.payload.data.role,
        };
      })
      .addCase(submitLogin.rejected, (state, action) => {
        state.isLoading = false;
        
        if (action.payload && typeof action.payload === 'object' && action.payload.type) {
          const { type, message } = action.payload;
          state.errors[type] = message;
        } else if (typeof action.payload === 'string') {
          state.errors.general = action.payload;
        } else {
          state.errors.general = 'Something went wrong. Please try again.';
        }
      });
  },
});

export const authActions = authSlice.actions;

export const authSelectors = {
  getLoginForm: (state) => state.auth.loginForm,
  getShowPassword: (state) => state.auth.showPassword,
  getIsLoading: (state) => state.auth.isLoading,
  getLoginErrors: (state) => state.auth.errors,
  getUser: (state) => state.auth.user,
};

export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser, saveNgoDetails } from '../services/signupService';


export const submitRegistration = createAsyncThunk(
  'signup/submitRegistration',
  async ({ formData, navigate }, { rejectWithValue }) => {
    try {
      const result = await registerUser(formData);
      const userData = result.data;


      localStorage.setItem('userId', userData.id);

      if (userData.role === 'admin' && userData.needsNGOSetup) {
        navigate('/ngo-setup', { state: { email: userData.email } });
    } else {
        navigate('/login');
      }

      return userData;

    } catch (err) {
      console.error("Signup error:", err);
      
      if (err.message) {
        if (err.message.toLowerCase().includes('already exists') || 
            err.message.toLowerCase().includes('email')) {
          return rejectWithValue({ 
            type: 'email', 
            message: err.message 
          });
        }
        
        if (err.message.toLowerCase().includes('password')) {
          return rejectWithValue({ 
            type: 'password', 
            message: err.message 
          });
        }
        
        if (err.message.toLowerCase().includes('role')) {
          return rejectWithValue({ 
            type: 'role', 
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


export const submitNgoDetails = createAsyncThunk(
  'signup/submitNgoDetails',
  async ({ formData, navigate }, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      console.log("💥 Loaded userId:", userId);
      const payload = { ...formData, userId };

      console.log("💥 Final NGO payload:", payload);

      await saveNgoDetails(payload);
      navigate('/login');
      return true;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to save NGO details.');
    }
  }
);



const initialState = {
  formData: {
    email: '',
    password: '',
    role: '',
  },

  ngoForm: {
    organizationName: '',
    contactPersonName: '',
    contactEmail: '',
    contactPhone: '',
    headOfficeAddress: '',
    operatingRegions: '',
    googleMapsLink: '',
    missionStatement: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
  },

  showPassword: false,
  isLoading: false,

  errors: {
    email: '',
    password: '',
    role: '',
    general: '',
  },
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    updateField(state, action) {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    updateNgoField(state, action) {
      const { field, value } = action.payload;
      state.ngoForm[field] = value;
    },
    clearError(state, action) {
      state.errors[action.payload] = '';
    },
    togglePasswordVisibility(state) {
      state.showPassword = !state.showPassword;
    },
    clearFormData(state) {
      state.formData = { email: '', password: '', role: '' };
    },
    clearNgoForm(state) {
      state.ngoForm = {
        organizationName: '',
        contactPersonName: '',
        contactEmail: '',
        contactPhone: '',
        headOfficeAddress: '',
        operatingRegions: '',
        googleMapsLink: '',
        missionStatement: '',
        website: '',
        facebook: '',
        instagram: '',
        linkedin: '',
      };
    },
    setError(state, action) {
      const { field, message } = action.payload;
      state.errors[field] = message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRegistration.pending, (state) => {
        state.isLoading = true;
        state.errors.general = '';
      })
      .addCase(submitRegistration.fulfilled, (state) => {
        state.isLoading = false;
        
        state.formData = { email: '', password: '', role: '' };
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.isLoading = false;
        
        if (action.payload && typeof action.payload === 'object' && action.payload.type) {
          const { type, message } = action.payload;
          state.errors[type] = message;
        } else if (typeof action.payload === 'string') {
          state.errors.general = action.payload;
        } else {
          state.errors.general = 'Something went wrong. Please try again.';
        }
      })
      .addCase(submitNgoDetails.pending, (state) => {
        state.isLoading = true;
        state.errors.general = '';
      })
      .addCase(submitNgoDetails.fulfilled, (state) => {
        state.isLoading = false;
        
        state.ngoForm = {
          organizationName: '',
          contactPersonName: '',
          contactEmail: '',
          contactPhone: '',
          headOfficeAddress: '',
          operatingRegions: '',
          googleMapsLink: '',
          missionStatement: '',
          website: '',
          facebook: '',
          instagram: '',
          linkedin: '',
        };
      })
      .addCase(submitNgoDetails.rejected, (state, action) => {
        state.isLoading = false;
        

        if (typeof action.payload === 'string') {
          state.errors.general = action.payload;
        } else {
          state.errors.general = 'Failed to save NGO details. Please try again.';
        }
      });
  },
});

export const signupActions = signupSlice.actions;

export const signupSelectors = {
  getFormData: (state) => state.signup.formData,
  getNgoForm: (state) => state.signup.ngoForm,
  getShowPassword: (state) => state.signup.showPassword,
  getIsLoading: (state) => state.signup.isLoading,
  getSignupErrors: (state) => state.signup.errors,
};

export default signupSlice.reducer;

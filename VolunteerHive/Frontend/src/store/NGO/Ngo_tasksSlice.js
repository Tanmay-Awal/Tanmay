import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchNgoTasks,
  fetchNgoTaskById,
  verifyNgoTaskStatus
} from '../../services/NGO/Ngo_tasksService';

import { deleteNgoTask as deleteNgoTaskAPI } from '../../services/NGO/Ngo_tasksService';


export const getNgoTasks = createAsyncThunk(
  'ngoTasks/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchNgoTasks();
      console.log("🔍 Service response:", res);
      console.log("🔍 Tasks data:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error in getNgoTasks:", err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);


export const getSingleNgoTask = createAsyncThunk(
  'ngoTasks/getSingle',
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await fetchNgoTaskById(taskId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);


export const verifyNgoTask = createAsyncThunk(
  'ngoTasks/verify',
  async ({ id, action, message, impactScore }, { rejectWithValue }) => {
    try {
      const res = await verifyNgoTaskStatus(id, action, message, impactScore);
      return {
        taskId: id,
        action: action,
        message: res.message,
        verifyStatus: action === 'approve' ? 'Approved' : 'Rejected',
        status: action === 'approve' ? 'verified' : 'rejected'
      };
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);


export const deleteNgoTask = createAsyncThunk(
  'ngoTasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteNgoTaskAPI(taskId);
      return { id: taskId };
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);

const Ngo_tasksSlice = createSlice({
  name: 'ngoTasks',
  initialState: {
    tasks: [],
    singleTask: null,
    loading: false,
    error: null,
    verifySuccess: null,
  },
  reducers: {
    clearVerifySuccess(state) {
      state.verifySuccess = null;
    },
    clearSingleTask(state) {
    state.singleTask = null;
    state.verifySuccess = null;
    state.loading = false;
    state.error = null;
  },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getNgoTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNgoTasks.fulfilled, (state, action) => {
        state.loading = false;
        console.log("🎯 Redux fulfilled payload:", action.payload);
        state.tasks = action.payload;
      })
      .addCase(getNgoTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching tasks.";
        console.error("❌ Redux rejected:", action.payload);
      })

      
      .addCase(getSingleNgoTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleNgoTask.fulfilled, (state, action) => {
        state.loading = false;
        state.singleTask = action.payload;
      })
      .addCase(getSingleNgoTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching task.";
      })

      
      .addCase(verifyNgoTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verifySuccess = null;
      })
      .addCase(verifyNgoTask.fulfilled, (state, action) => {
        state.loading = false;
        state.verifySuccess = action.payload.message;

        const { taskId, verifyStatus, status } = action.payload;
        const taskIndex = state.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex].verified = verifyStatus;
          state.tasks[taskIndex].status = status;
        }
        if (state.singleTask && state.singleTask.id === taskId) {
          state.singleTask.verified = verifyStatus;
          state.singleTask.status = status;
        }
      })
      .addCase(verifyNgoTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error verifying task.";
      })

      
      .addCase(deleteNgoTask.fulfilled, (state, action) => {
        const deletedId = action.payload.id;
        state.tasks = state.tasks.filter(task => task.id !== deletedId);
      });
  },
});

export const { clearVerifySuccess } = Ngo_tasksSlice.actions;
export const {clearSingleTask} = Ngo_tasksSlice.actions;
export default Ngo_tasksSlice.reducer;

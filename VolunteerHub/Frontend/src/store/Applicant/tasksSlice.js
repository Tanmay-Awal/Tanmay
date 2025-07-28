
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks, startTask, completeTask } from "../../services/Applicant/taskService";
import { deleteTask as deleteTaskAPI } from "../../services/Applicant/taskService";


export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (email, { rejectWithValue }) => {
    try {
      console.log("🚀 Fetching tasks for email:", email);
      const tasks = await getTasks(email);
      console.log("✅ Tasks response:", tasks);
      return tasks;
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
      return rejectWithValue(err.message);
    }
  }
);

export const markTaskStarted = createAsyncThunk(
  "tasks/markTaskStarted",
  async (taskId, { rejectWithValue }) => {
    try {
      await startTask(taskId);
      return taskId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markTaskCompleted = createAsyncThunk(
  "tasks/markTaskCompleted",
  async (taskId, { rejectWithValue }) => {
    try {
      await completeTask(taskId);
      return taskId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



export const softDeleteTask = createAsyncThunk(
  "tasks/softDeleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteTaskAPI(taskId);
      return taskId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: "",
  },
  reducers: {
    updateTaskVerification: (state, action) => {
      const { taskId, verified, status } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.verified = verified;
        task.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markTaskStarted.fulfilled, (state, action) => {
        const id = action.payload;
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          task.status = 'In Progress';
        }
      })
      .addCase(markTaskCompleted.fulfilled, (state, action) => {
        const id = action.payload;
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          task.status = 'Completed';
        }
      })
      .addCase(softDeleteTask.fulfilled, (state, action) => {
        const id = action.payload;
        state.tasks = state.tasks.filter(task => task.id !== id);
      });
  },
});

export const { updateTaskVerification } = tasksSlice.actions;

export const tasksSelectors = {
  getTasks: (state) => state.tasks.tasks,
  getTasksLoading: (state) => state.tasks.loading,
  getTasksError: (state) => state.tasks.error,
};

export default tasksSlice.reducer;
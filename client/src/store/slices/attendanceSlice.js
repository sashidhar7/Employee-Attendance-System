import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const initialState = {
  attendance: [],
  todayStatus: null,
  summary: null,
  dashboard: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Helper to get auth header
const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Check In
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/attendance/checkin`,
        {},
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Check Out
export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(
        `${API_URL}/attendance/checkout`,
        {},
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get My History
export const getMyHistory = createAsyncThunk(
  'attendance/getMyHistory',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/attendance/my-history`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get My Summary
export const getMySummary = createAsyncThunk(
  'attendance/getMySummary',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/attendance/my-summary`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Today Status
export const getTodayStatus = createAsyncThunk(
  'attendance/getTodayStatus',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/attendance/today`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Employee Dashboard
export const getEmployeeDashboard = createAsyncThunk(
  'attendance/getEmployeeDashboard',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/dashboard/employee`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get All Attendance (Manager)
export const getAllAttendance = createAsyncThunk(
  'attendance/getAllAttendance',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/manager/attendance/all`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Manager Dashboard
export const getManagerDashboard = createAsyncThunk(
  'attendance/getManagerDashboard',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/dashboard/manager`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Team Summary (Manager)
export const getTeamSummary = createAsyncThunk(
  'attendance/getTeamSummary',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/manager/attendance/summary`,
        getAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Export CSV (Manager)
export const exportCSV = createAsyncThunk(
  'attendance/exportCSV',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(
        `${API_URL}/manager/attendance/export`,
        {
          ...getAuthHeader(token),
          responseType: 'blob',
        }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { message: 'CSV exported successfully' };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Check In
      .addCase(checkIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todayStatus = action.payload.attendance;
        state.message = action.payload.message;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todayStatus = action.payload.record;
        state.message = action.payload.message;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get My History
      .addCase(getMyHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload;
      })
      .addCase(getMyHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get My Summary
      .addCase(getMySummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      // Get Today Status
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.todayStatus = action.payload;
      })
      // Get Employee Dashboard
      .addCase(getEmployeeDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployeeDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(getEmployeeDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get All Attendance (Manager)
      .addCase(getAllAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Manager Dashboard
      .addCase(getManagerDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Export CSV
      .addCase(exportCSV.fulfilled, (state, action) => {
        state.message = action.payload.message;
      });
  },
});

export const { reset } = attendanceSlice.actions;
export default attendanceSlice.reducer;

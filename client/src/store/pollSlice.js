import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPoll: null,
  pollHistory: [],
  students: [],
  results: null,
  isLoading: false,
  error: null,
  timeRemaining: 0,
};

export const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setCurrentPoll: (state, action) => {
      state.currentPoll = action.payload;
      if (action.payload) {
        state.timeRemaining = action.payload.timeLimit || 60;
      }
    },
    updatePoll: (state, action) => {
      if (state.currentPoll) {
        state.currentPoll = { ...state.currentPoll, ...action.payload };
      }
    },
    setResults: (state, action) => {
      state.results = action.payload;
      state.currentPoll = null;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    decrementTime: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearPoll: (state) => {
      state.currentPoll = null;
      state.results = null;
      state.timeRemaining = 0;
    },
  },
});

export const {
  setCurrentPoll,
  updatePoll,
  setResults,
  setStudents,
  setPollHistory,
  setTimeRemaining,
  decrementTime,
  setLoading,
  setError,
  clearError,
  clearPoll,
} = pollSlice.actions;

export default pollSlice.reducer;

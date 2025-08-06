import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userType: null, // 'teacher' or 'student'
  studentName: null,
  studentId: null,
  isConnected: false,
  hasAnswered: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setStudentInfo: (state, action) => {
      const { name, id } = action.payload;
      state.studentName = name;
      state.studentId = id;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    clearUser: (state) => {
      state.userType = null;
      state.studentName = null;
      state.studentId = null;
      state.isConnected = false;
      state.hasAnswered = false;
    },
  },
});

export const {
  setUserType,
  setStudentInfo,
  setConnected,
  setHasAnswered,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;

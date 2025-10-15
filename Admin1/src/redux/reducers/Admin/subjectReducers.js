import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjects: [],
  loading: false,
};

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
    addSubject: (state, action) => {
      state.subjects.push(action.payload);
    },
    updateSubject: (state, action) => {
      const index = state.subjects.findIndex(
        (s) => s.subject_id === action.payload.subject_id
      );
      if (index >= 0) state.subjects[index] = action.payload;
    },
    deleteSubject: (state, action) => {
      state.subjects = state.subjects.filter(
        (s) => s.subject_id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSubjects, addSubject, updateSubject, deleteSubject, setLoading } =
  subjectSlice.actions;

export default subjectSlice.reducer;

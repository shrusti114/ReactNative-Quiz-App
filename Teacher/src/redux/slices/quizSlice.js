import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchQuizzes = createAsyncThunk("quiz/fetchAll", async () => {
  const res = await fetch("http://localhost:5000/quizzes");
  return await res.json();
});

export const addQuiz = createAsyncThunk("quiz/add", async (quiz) => {
  const res = await fetch("http://localhost:5000/quizzes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quiz),
  });
  return await res.json();
});

export const updateQuiz = createAsyncThunk("quiz/update", async ({ id, quiz }) => {
  const res = await fetch(`http://localhost:5000/quizzes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quiz),
  });
  return await res.json();
});

export const deleteQuiz = createAsyncThunk("quiz/delete", async (id) => {
  await fetch(`http://localhost:5000/quizzes/${id}`, { method: "DELETE" });
  return id;
});

const quizSlice = createSlice({
  name: "quiz",
  initialState: { quizzes: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.fulfilled, (state, action) => { state.quizzes = action.payload; })
      .addCase(addQuiz.fulfilled, (state, action) => { state.quizzes.push(action.payload); })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((q) => (q._id === action.payload._id ? action.payload : q));
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
      });
  },
});

export default quizSlice.reducer;

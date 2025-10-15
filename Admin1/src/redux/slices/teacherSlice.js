// // src/redux/slices/teacherSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const BASE_URL = "http://localhost:5000/teachers";

// // Fetch all teachers
// export const fetchTeachers = createAsyncThunk("teachers/fetch", async () => {
//   const res = await fetch(BASE_URL);
//   return await res.json();
// });

// // Add teacher
// export const addTeacher = createAsyncThunk("teachers/add", async (teacher) => {
//   const res = await fetch(BASE_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(teacher),
//   });
//   return await res.json();
// });

// // Delete teacher
// export const deleteTeacher = createAsyncThunk("teachers/delete", async (id) => {
//   await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
//   return id;
// });

// const teacherSlice = createSlice({
//   name: "teachers",
//   initialState: { list: [], loading: false, error: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTeachers.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTeachers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload;
//       })
//       .addCase(addTeacher.fulfilled, (state, action) => {
//         state.list.push(action.payload);
//       })
//       .addCase(deleteTeacher.fulfilled, (state, action) => {
//         state.list = state.list.filter((item) => item._id !== action.payload);
//       });
//   },
// });

// export default teacherSlice.reducer;

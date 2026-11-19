import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    setCourses: (state, action) => {
      return action.payload || [];
    },
    addCourse: (state, action) => {
      const maxId = state.reduce((max, c) => (c.id > max ? c.id : max), 0);
      state.push({ ...action.payload, id: maxId + 1 });
    },
    removeCourse: (state, action) => {
      return state.filter((c) => c.id !== action.payload);
    },
    setScore: (state, action) => {
      const item = state.find((c) => c.id === action.payload.id);
      if (item) {
        item.score = action.payload.score;
      }
    },
  },
});

export const { setCourses, addCourse, removeCourse, setScore } = coursesSlice.actions;
export const selectCourses = (state) => state.courses;
export default coursesSlice.reducer;

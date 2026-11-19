import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './features/coursesSlice';
import goalReducer from './features/goalSlice';
import { loadSaved, saveCourses } from './storage';

export const hasSaved = loadSaved() !== null;

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    goal: goalReducer,
  },
  preloadedState: {
    courses: loadSaved() ?? [],
  },
});

let prevCourses = store.getState().courses;
store.subscribe(() => {
  const currentCourses = store.getState().courses;
  if (prevCourses !== currentCourses) {
    prevCourses = currentCourses;
    saveCourses(currentCourses);
  }
});

export default store;

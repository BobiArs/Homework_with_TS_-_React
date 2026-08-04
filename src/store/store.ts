import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import filtersReducer from "./filtersSlice";

//Глобальний стор
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filters: filtersReducer,
  },
});

// Підписка на оновлення стору для збереження завдань у LocalStorage
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem("tasks", JSON.stringify(state.tasks.items));
  } catch (error) {
    console.error("Помилка при збереженні завдань у LocalStorage:", error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

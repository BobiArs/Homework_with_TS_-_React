//Слайс для завдань
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  text: string;
  category: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

interface TasksState {
  items: Task[];
}

// Функція для завантаження початкових даних з LocalStorage
const loadTasksFromLocalStorage = (): Task[] => {
  try {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Помилка при завантаженні завдань з LocalStorage:", error);
    return [];
  }
};

const initialState: TasksState = {
  items: loadTasksFromLocalStorage(),
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Додавання завдання (Immer під капотом дозволяє .push)
    addTask: (
      state,
      action: PayloadAction<{
        text: string;
        category: string;
        priority: Priority;
      }>,
    ) => {
      const newTask: Task = {
        id: Date.now().toString(),
        text: action.payload.text,
        category: action.payload.category || "Загальне",
        priority: action.payload.priority,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newTask);
    },

    // Видалення завдання
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },

    // Перемикання статусу виконано/не виконано
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.items.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },

    // Редагування тексту завдання
    editTaskText: (
      state,
      action: PayloadAction<{ id: string; text: string }>,
    ) => {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task && action.payload.text.trim()) {
        task.text = action.payload.text;
      }
    },

    // Очистити всі виконані завдання
    clearCompletedTasks: (state) => {
      state.items = state.items.filter((task) => !task.completed);
    },
  },
});

export const {
  addTask,
  deleteTask,
  toggleTaskStatus,
  editTaskText,
  clearCompletedTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;

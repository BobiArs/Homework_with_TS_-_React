git checkout -b home-work# Практичне завдання: Панель керування завданнями (Task Management Board)

У цьому практичному завданні ви розробите додаток для управління завданнями з можливістю категорізації, встановлення пріоритетів, пошуку та фільтрації. Це завдання допоможе вам застосувати Redux Toolkit, навчитися керувати взаємопов'язаним станом та налаштувати типізацію з TypeScript.

---

## 🚀 Вимоги до додатка

Додаток має містити:

1. **Форму додавання завдання** (текст, категорія, рівень пріоритету).
2. **Панель фільтрації та пошуку** (пошук за назвою, фільтрація за категорією, пріоритетом та статусом виконання).
3. **Список завдань** (можливість відмітити як виконане, видалити завдання або редагувати його текст).
4. **Статистику** (загальна кількість завдань, кількість виконаних та відсоток завершення).

---

## 🛠️ Крок 1. Встановлення пакетів

У вашому React + TypeScript проекті встановіть необхідні залежності:

```bash
npm install @reduxjs/toolkit react-redux
```

---

## 📁 Крок 2. Структура коду

Рекомендуємо створити таку структуру директорій та файлів для Redux-стейту:

```
src/
├── store/
│   ├── store.ts             # Глобальний стор
│   ├── hooks.ts             # Типізовані хуки
│   ├── tasksSlice.ts        # Слайс для завдань
│   └── filtersSlice.ts      # Слайс для фільтрів
```

---

## 📝 Крок 3. Визначення типів та створення `tasksSlice.ts`

Створіть файл `src/store/tasksSlice.ts`. Тут ми опишемо сутність завдання та екшени для взаємодії зі списком завдань.

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
```

---

## 🔍 Крок 4. Створення `filtersSlice.ts`

Створіть файл `src/store/filtersSlice.ts` для керування станом фільтрації.

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Priority } from "./tasksSlice";

export type StatusFilter = "all" | "completed" | "active";

interface FiltersState {
  searchQuery: string;
  category: string; // 'all' або конкретна категорія
  priority: "all" | Priority;
  status: StatusFilter;
}

const initialState: FiltersState = {
  searchQuery: "",
  category: "all",
  priority: "all",
  status: "all",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<"all" | Priority>) => {
      state.priority = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.status = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearchQuery,
  setCategoryFilter,
  setPriorityFilter,
  setStatusFilter,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
```

---

## ⚙️ Крок 5. Конфігурація `store.ts` та типізація хуків `hooks.ts`

Об'єднаємо редьюсери в `src/store/store.ts`:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import filtersReducer from "./filtersSlice";

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
```

Створіть типізовані хуки у `src/store/hooks.ts`:

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## 🖥️ Крок 6. Створення інтерфейсу

### 1. Форма додавання завдання (`src/components/TaskForm.tsx`)

```tsx
import React, { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { addTask } from "../store/tasksSlice";
import { Priority } from "../store/tasksSlice";

export const TaskForm = () => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    dispatch(addTask({ text, category, priority }));
    setText("");
    setCategory("");
    setPriority("medium");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 mb-6 p-5 bg-white border border-zinc-200 rounded-2xl shadow-2xs"
    >
      <input
        type="text"
        placeholder="Що потрібно зробити?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
      />
      <input
        type="text"
        placeholder="Категорія (напр. Робота)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
      >
        <option value="low">Низький пріоритет</option>
        <option value="medium">Середній пріоритет</option>
        <option value="high">Високий пріоритет</option>
      </select>
      <button
        type="submit"
        className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl transition-all shadow-xs cursor-pointer"
      >
        Додати
      </button>
    </form>
  );
};
```

### 2. Панель фільтрів (`src/components/TaskFilters.tsx`)

```tsx
import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setSearchQuery,
  setCategoryFilter,
  setPriorityFilter,
  setStatusFilter,
  resetFilters,
} from "../store/filtersSlice";
import { StatusFilter } from "../store/filtersSlice";
import { Priority } from "../store/tasksSlice";

export const TaskFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  // Отримуємо унікальні категорії зі списку завдань для динамічного фільтра
  const tasks = useAppSelector((state) => state.tasks.items);
  const categories = Array.from(
    new Set(tasks.map((t) => t.category).filter(Boolean)),
  );

  return (
    <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl mb-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Пошуковий інпут */}
        <input
          type="text"
          placeholder="Пошук завдань..."
          value={filters.searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="flex-1 px-3.5 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
        />

        {/* Фільтр статусу */}
        <select
          value={filters.status}
          onChange={(e) =>
            dispatch(setStatusFilter(e.target.value as StatusFilter))
          }
          className="px-3.5 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
        >
          <option value="all">Усі статуси</option>
          <option value="active">Активні</option>
          <option value="completed">Виконані</option>
        </select>

        {/* Фільтр пріоритету */}
        <select
          value={filters.priority}
          onChange={(e) =>
            dispatch(setPriorityFilter(e.target.value as "all" | Priority))
          }
          className="px-3.5 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
        >
          <option value="all">Усі пріоритети</option>
          <option value="low">Низький пріоритет</option>
          <option value="medium">Середній пріоритет</option>
          <option value="high">Високий пріоритет</option>
        </select>

        {/* Динамічний фільтр категорій */}
        <select
          value={filters.category}
          onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
          className="px-3.5 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
        >
          <option value="all">Усі категорії</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={() => dispatch(resetFilters())}
          className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-200/50 hover:bg-zinc-200 rounded-xl active:scale-95 transition-all cursor-pointer"
        >
          Скинути
        </button>
      </div>
    </div>
  );
};
```

### 3. Компонент статистики (`src/components/TaskStats.tsx`)

```tsx
import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCompletedTasks } from "../store/tasksSlice";

export const TaskStats = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-zinc-200 mb-6 text-sm text-zinc-600">
      <div className="flex flex-wrap items-center gap-3">
        <span>
          Всього:{" "}
          <strong className="text-zinc-900 font-semibold">{total}</strong>
        </span>
        <span className="text-zinc-350">|</span>
        <span>
          Активних:{" "}
          <strong className="text-zinc-900 font-semibold">{active}</strong>
        </span>
        <span className="text-zinc-350">|</span>
        <span>
          Виконаних:{" "}
          <strong className="text-emerald-600 font-semibold">
            {completed}
          </strong>{" "}
          ({percentage}%)
        </span>
      </div>
      {completed > 0 && (
        <button
          onClick={() => dispatch(clearCompletedTasks())}
          className="px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-150/10 rounded-xl active:scale-95 transition-all shadow-3xs cursor-pointer"
        >
          Видалити виконані
        </button>
      )}
    </div>
  );
};
```

### 4. Список завдань з обчислюваним станом (`src/components/TaskList.tsx`)

```tsx
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  toggleTaskStatus,
  deleteTask,
  editTaskText,
} from "../store/tasksSlice";
import { Task } from "../store/tasksSlice";

export const TaskList = () => {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector((state) => state.tasks.items);
  const filters = useAppSelector((state) => state.filters);

  // Стан для редагування елемента
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Обчислюваний (відфільтрований) список завдань на основі обох слайсів
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text
      .toLowerCase()
      .includes(filters.searchQuery.toLowerCase());

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "completed" && task.completed) ||
      (filters.status === "active" && !task.completed);

    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    const matchesCategory =
      filters.category === "all" || task.category === filters.category;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id: string) => {
    dispatch(editTaskText({ id, text: editText }));
    setEditingId(null);
  };

  if (filteredTasks.length === 0) {
    return (
      <p className="text-center py-8 text-zinc-500 bg-zinc-50 border border-zinc-200 border-dashed rounded-2xl">
        Жодного завдання не знайдено за вказаними фільтрами.
      </p>
    );
  }

  const getPriorityClasses = (p: string) => {
    if (p === "high")
      return "bg-rose-50/50 border-rose-100 hover:border-rose-200 text-rose-900";
    if (p === "medium")
      return "bg-amber-50/50 border-amber-100 hover:border-amber-200 text-amber-900";
    return "bg-emerald-50/50 border-emerald-100 hover:border-emerald-200 text-emerald-900";
  };

  const getPriorityBadgeClasses = (p: string) => {
    if (p === "high") return "bg-rose-100 text-rose-700 border-rose-200/50";
    if (p === "medium")
      return "bg-amber-100 text-amber-700 border-amber-200/50";
    return "bg-emerald-100 text-emerald-700 border-emerald-200/50";
  };

  return (
    <ul className="space-y-3">
      {filteredTasks.map((task) => (
        <li
          key={task.id}
          className={`flex items-center justify-between p-4 border rounded-2xl shadow-3xs transition-all duration-200 ${getPriorityClasses(
            task.priority,
          )}`}
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => dispatch(toggleTaskStatus(task.id))}
              className="w-5 h-5 text-indigo-600 bg-white border-zinc-300 rounded-md focus:ring-indigo-500 cursor-pointer"
            />

            {editingId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(task.id)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                autoFocus
                className="flex-1 px-2.5 py-1 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all text-zinc-900"
              />
            ) : (
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md bg-white/70 border border-zinc-200/20 shadow-4xs text-zinc-600">
                  {task.category}
                </span>
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                  className={`truncate text-sm font-medium cursor-pointer ${
                    task.completed
                      ? "text-zinc-400 opacity-60"
                      : "text-zinc-900"
                  }`}
                  onClick={() => startEditing(task)}
                  title="Клікніть для редагування"
                >
                  {task.text}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-4">
            <span
              className={`shrink-0 hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md border ${getPriorityBadgeClasses(task.priority)}`}
            >
              {task.priority === "high"
                ? "Високий"
                : task.priority === "medium"
                  ? "Середній"
                  : "Низький"}
            </span>
            <button
              onClick={() => startEditing(task)}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-650 hover:text-zinc-900 bg-white/50 hover:bg-white rounded-lg active:scale-95 border border-zinc-200/30 transition-all cursor-pointer"
            >
              Редагувати
            </button>
            <button
              onClick={() => dispatch(deleteTask(task.id))}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-150/20 rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              Видалити
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
```

---

## 🎯 Критерії оцінювання практичної роботи

1. **Правильність налаштування Redux Store**: використання `configureStore`, підключення обох редьюсерів (`tasks` та `filters`).
2. **Типізація**: наявність типізованих хуків `useAppDispatch` та `useAppSelector` у файлі `hooks.ts` та їх використання у всіх компонентах.
3. **Обчислювальний стан (Deriving State)**: обчислення відфільтрованого списку завдань та статистики безпосередньо у тілі компонентів (або за допомогою селекторів) на основі даних зі стору, без збереження дублюючих даних у стейті.
4. **Використання Immer**: редьюсери для додавання чи оновлення стану мають використовувати безпечні мутації (`push`, пряме переприсвоєння прапорців).
5. **Робочий інтерфейс**: користувач може додавати, видаляти, редагувати, перемикати статус завдань та шукати/фільтрувати їх у реальному часі.
6. **Збереження стану (LocalStorage)**: реалізація збереження списку завдань у LocalStorage при будь-якіх змінах стану стору (через підписку `store.subscribe`) та відновлення списку з LocalStorage при першому завантаженні додатка.

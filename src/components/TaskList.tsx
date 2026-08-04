import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteTask,
  editTaskText,
  toggleTaskStatus,
  type Task,
} from "../store/tasksSlice";

//Список завдань з обчислюваним станом
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

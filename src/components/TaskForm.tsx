//Форма додавання завдання

import { useState } from "react";
import { addTask, type Priority } from "../store/tasksSlice";
import { useAppDispatch } from "../store/hooks";

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

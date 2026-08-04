//Компонент статистики, або просто елементи для статистики

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

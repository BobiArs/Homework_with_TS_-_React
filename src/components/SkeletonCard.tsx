import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/50 shadow-sm animate-pulse">
      {/* Скелет співвідношення сторін мініатюри */}
      <div className="aspect-[16/10] bg-zinc-200 dark:bg-zinc-800 w-full"></div>

      <div className="p-6 space-y-4">
        {/* Значок категорії та скелет дати */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-20"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-16"></div>
        </div>

        {/* Назва скелету */}
        <div className="space-y-2">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full"></div>
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4"></div>
        </div>

        {/* Скелет зведення */}
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-5/6"></div>
        </div>

        {/* Читати далі та скелет для автора */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/55 flex items-center justify-between">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-24"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-16"></div>
        </div>
      </div>
    </div>
  );
};

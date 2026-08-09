import React from "react";

export const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-zinc-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium animate-pulse">
        Завантаження новин...
      </p>
    </div>
  );
};

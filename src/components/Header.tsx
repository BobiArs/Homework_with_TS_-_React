import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2.5 group transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all duration-300">
            <span className="text-white font-extrabold text-xl tracking-wider">N</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              VortexNews
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase -mt-1">
              Локальний вісник
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            Головна
          </Link>
          <a 
            href="#about" 
            onClick={(e) => {
              e.preventDefault();
              alert("Цей демо-портал створено для демонстрації роботи з MSW!");
            }}
            className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            Про проект
          </a>
        </nav>
      </div>
    </header>
  );
};

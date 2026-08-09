import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SkeletonCard } from "../components/SkeletonCard";
import type { News } from "../mocks/db";

// Допоміжна функція для призначення кольорів значків на основі категорії
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Технології":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    case "Спорт":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    case "Культура":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
    case "Наука":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
    case "Економіка":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20";
  }
};

export const NewsListPage: React.FC = () => {
  const [newsList, setNewsList] = useState<Omit<News, "content">[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Не вдалося завантажити стрічку новин.");
        }
        return res.json();
      })
      .then((data) => {
        setNewsList(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Сталася помилка при завантаженні новин.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-3xl text-center shadow-lg">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/60 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-rose-600 dark:text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-2">
          Помилка
        </h3>
        <p className="text-rose-700 dark:text-rose-400 text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-rose-600/10"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center md:text-left">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-full border border-indigo-200/30">
          Актуальне
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-4">
          Свіжі новини порталу
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base max-w-xl">
          Слідкуйте за найважливішими подіями у світі технологій, спорту,
          культури та економіки.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((item) => (
            <article
              key={item.id}
              className="group bg-white dark:bg-zinc-900/60 rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/40 hover:border-indigo-500/30 hover:dark:border-indigo-400/20 shadow-sm hover:shadow-xl dark:shadow-zinc-950/50 hover:dark:shadow-indigo-950/10 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3.5">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryColor(item.category)}`}
                  >
                    {item.category}
                  </span>
                  <time className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                    {new Date(item.createdAt).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 mb-2.5">
                  <Link to={`/news/${item.id}`}>{item.title}</Link>
                </h3>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed flex-grow mb-5">
                  {item.summary}
                </p>

                {/* Card Footer */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                    Автор:{" "}
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {item.author}
                    </span>
                  </span>
                  <Link
                    to={`/news/${item.id}`}
                    className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200"
                  >
                    Читати далі
                    <svg
                      className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

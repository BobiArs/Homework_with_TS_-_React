import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import type { News } from "../mocks/db";

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

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<News | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<number | string | null>(null);

  const [prevId, setPrevId] = useState<string | undefined>(id);
  if (id !== prevId) {
    setPrevId(id);
    setLoading(true);
    setNewsItem(null);
    setError(null);
  }

  useEffect(() => {
    if (!id) return;
    fetch(`/api/news/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw res.status;
        }
        return res.json();
      })
      .then((data) => {
        setNewsItem(data);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  // 404 Обробка або стани помилок
  if (error === 404 || !newsItem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100 dark:border-indigo-900/30 shadow-inner">
          <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            404
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white mb-2">
          Новину не знайдено
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
          На жаль, новини за вказаним ідентифікатором не існує або її було
          видалено з серверу.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200"
        >
          <svg
            className="w-5 h-5 mr-2 transform rotate-180"
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
          Повернутися на головну
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-3xl text-center shadow-lg">
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-2">
          Помилка мережі
        </h3>
        <p className="text-rose-700 dark:text-rose-400 text-sm mb-6">
          Не вдалося завантажити повну статтю. Спробуйте оновити сторінку.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors"
        >
          На головну
        </Link>
      </div>
    );
  }

  // Форматування абзаців вмісту
  const paragraphs = newsItem.content.split("\n\n");

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors duration-200 mb-8 group"
      >
        <svg
          className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Назад до новин
      </Link>

      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getCategoryColor(newsItem.category)}`}
          >
            {newsItem.category}
          </span>
          <time className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
            {new Date(newsItem.createdAt).toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
          {newsItem.title}
        </h1>
        <div className="flex items-center pt-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs mr-2.5">
            {newsItem.author.charAt(0)}
          </div>
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            {newsItem.author}
          </span>
        </div>
      </div>

      <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-md border border-zinc-200/50 dark:border-zinc-800/40 mb-10 bg-zinc-100 dark:bg-zinc-800">
        <img
          src={newsItem.imageUrl}
          alt={newsItem.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 antialiased"
          >
            {p}
          </p>
        ))}
      </div>
    </article>
  );
};

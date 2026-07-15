import { useState } from "react";
import { apiClient } from "../utils/api";

interface Post {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

interface PostsListProps {
  posts: Post[];
  selectedPostId: number | null;
  onSelectedPostId: (id: number) => void;
  onPostsLoaded: (posts: Post[]) => void;
  onDeletePost: (id: number) => void;
}

export default function PostsList({
  posts,
  selectedPostId,
  onSelectedPostId,
  onPostsLoaded,
  onDeletePost,
}: PostsListProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient<Post[]>("/posts", {
        params: { _limit: 10 },
      });
      onPostsLoaded(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Чогось не вдалось завантажити ваші пости, спробуйте пізніше");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-5 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 m-0">
          Список постів
        </h2>
        <button
          onClick={loadPosts}
          disabled={loading}
          className="px-4 py-2 bg-violet-600 dark:bg-violet-500 hover:bg-violet-700 dark:hover:bg-violet-600 text-white rounded-lg font-medium shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Завантаження...
            </>
          ) : (
            "Завантажити пости 📥"
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-8 text-slate-400 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
          Немає постів. Натисніть кнопку "Завантажити пости" або створіть новий!
        </div>
      )}

      <ul className="flex flex-col gap-3 p-0 m-0 list-none">
        {posts.map((post) => {
          const isSelected = selectedPostId === post.id;
          return (
            <li
              key={post.id}
              onClick={() => onSelectedPostId(post.id)}
              className={`group flex items-start justify-between gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/20 text-violet-900 dark:text-violet-100"
                  : "border-slate-100 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-zinc-200 line-clamp-1 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors duration-150">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 dark:text-zinc-500 line-clamp-2 mt-1">
                  {post.body}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePost(post.id);
                }}
                className="p-2 text-slate-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                title="Видалити пост"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


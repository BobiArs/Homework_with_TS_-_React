import { useEffect, useState } from "react";
import { apiClient } from "../utils/api";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  website?: string;
}

export default function PostDetails({ postId }: { postId: number | null }) {
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setPost(null);
      setAuthor(null);
      return;
    }

    const controller = new AbortController();

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setPost(null);
        setAuthor(null);

        // Fetch post using apiClient
        const postData = await apiClient<Post>(`/posts/${postId}`, {
          signal: controller.signal,
        });
        setPost(postData);

        // Fetch user using apiClient
        const userData = await apiClient<User>(`/users/${postData.userId}`, {
          signal: controller.signal,
        });
        setAuthor(userData);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Запит детальної інформації про пост скасовано");
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Не вдалося завантажити деталі поста",
          );
        }
      } finally {
        // Only stop loading if the request was not aborted (to prevent flashing)
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();
    return () => {
      controller.abort();
    };
  }, [postId]);

  if (!postId) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-3 py-16 bg-white dark:bg-zinc-900 transition-colors duration-300">
        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-xl shadow-sm text-slate-400 dark:text-zinc-500">
          📄
        </div>
        <p className="text-slate-500 dark:text-zinc-400 font-medium m-0">
          Оберіть пост для перегляду
        </p>
        <p className="text-xs text-slate-400 dark:text-zinc-500 m-0 max-w-xs leading-relaxed">
          Клацніть на будь-який пост у списку зліва, щоб переглянути його повний
          вміст та інформацію про автора.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-5 animate-pulse transition-colors duration-300">
        <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded-md w-3/4" />
        <div className="space-y-2 mt-2">
          <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-full" />
          <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-full" />
          <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-5/6" />
        </div>
        <div className="h-px bg-slate-100 dark:bg-zinc-800 w-full my-3" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-1/3" />
            <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded-md w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 sm:p-6 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-sm flex items-start gap-2.5 transition-colors duration-300">
        <span>⚠️</span>
        <div className="flex-1">
          <h4 className="font-semibold m-0">Помилка завантаження</h4>
          <p className="mt-1 m-0 text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const authorInitials = author
    ? author.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-6 transition-all duration-300">
      {post && (
        <article className="flex flex-col gap-4">
          <div className="inline-flex items-center justify-center self-start px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30">
            Пост #{post.id}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight leading-snug m-0">
            {post.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed m-0 whitespace-pre-wrap">
            {post.body}
          </p>
        </article>
      )}

      {author && (
        <div className="flex flex-col gap-4 pt-6 border-t border-slate-100 dark:border-zinc-800 mt-2">
          <h4 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider m-0">
            Інформація про автора
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-violet-500/10 shrink-0">
              {authorInitials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-base m-0 leading-tight">
                {author.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 m-0 mt-0.5 truncate">
                @{author.username} • {author.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

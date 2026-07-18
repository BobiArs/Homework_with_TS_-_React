import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { PostDTO, UserDTO } from "../types/api.types";
import { getPostById, updatePost } from "../api/postsApi";
import { getUserById } from "../api/usersApi";
import axios from "axios";

export default function PostDetails({
  postId,
  onUpdatePost,
}: {
  postId: number | null;
  onUpdatePost?: (updatedPost: PostDTO) => void;
}) {
  const [post, setPost] = useState<PostDTO | null>(null);
  const [author, setAuthor] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    setIsEditing(false);
    setUpdateError(null);
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

        const postData = await getPostById(postId, {
          signal: controller.signal,
        });
        setPost(postData);

        const userData = await getUserById(postData.userId, {
          signal: controller.signal,
        });
        setAuthor(userData);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Запит детальної інформації про пост скасовано");
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Не вдалося завантажити деталі поста"
          );
        }
      } finally {
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

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      setIsUpdating(true);
      setUpdateError(null);
      const updatedData = await updatePost(post.id, {
        title: editTitle,
        body: editBody,
      });
      setPost(updatedData);
      if (onUpdatePost) {
        onUpdatePost(updatedData);
      }
      setIsEditing(false);
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Не вдалося зберегти зміни"
      );
    } finally {
      setIsUpdating(false);
    }
  };

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
      {post &&
        (isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="inline-flex items-center justify-center self-start px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30">
              Редагування поста #{post.id}
            </div>
            {updateError && (
              <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg">
                ⚠️ {updateError}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Заголовок
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-zinc-800/30 text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none transition-all duration-200 border-slate-100 dark:border-zinc-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Текст поста
              </label>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                required
                rows={5}
                className="px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-zinc-800/30 text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none resize-y min-h-[100px] transition-all duration-200 border-slate-100 dark:border-zinc-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 bg-violet-600 dark:bg-violet-500 hover:bg-violet-700 dark:hover:bg-violet-600 text-white rounded-lg font-medium shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? "Збереження..." : "Зберегти 💾"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isUpdating}
                className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Скасувати
              </button>
            </div>
          </form>
        ) : (
          <article className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30">
                Пост #{post.id}
              </div>
              <button
                onClick={() => {
                  setEditTitle(post.title);
                  setEditBody(post.body);
                  setIsEditing(true);
                  setUpdateError(null);
                }}
                className="px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 border border-violet-200 dark:border-violet-900/50 rounded-lg transition-colors cursor-pointer"
              >
                Редагувати ✏️
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight leading-snug m-0">
              {post.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed m-0 whitespace-pre-wrap">
              {post.body}
            </p>
          </article>
        ))}

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

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import type { PostDTO } from "../types/api.types";
import { getPostById, updatePost } from "../api/postsApi";
import { getUserById } from "../api/usersApi";

export default function PostDetails({
  postId,
  onUpdatePost,
}: {
  postId: number | null;
  onUpdatePost?: (updatedPost: PostDTO) => void;
}) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const {
    data: post,
    isPending: postLoading,
    isError: postError,
    error: postErrorObj,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId,
  });

  const { data: author } = useQuery({
    queryKey: ["user", post?.userId],
    queryFn: () => getUserById(post!.userId),
    enabled: !!post?.userId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; title: string; body: string }) =>
      updatePost(data.id, {
        title: data.title,
        body: data.body,
      }),
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });

      if (onUpdatePost) {
        onUpdatePost(updatedData);
      }
      setIsEditing(false);
    },
  });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!post) return;

    updateMutation.mutate({
      id: post.id,
      title: editTitle,
      body: editBody,
    });
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

  if (postLoading) {
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

  if (postError) {
    return (
      <div className="p-5 sm:p-6 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-sm flex items-start gap-2.5 transition-colors duration-300">
        <span>⚠️</span>
        <div className="flex-1">
          <h4 className="font-semibold m-0">Помилка завантаження</h4>
          <p className="mt-1 m-0 text-red-600 dark:text-red-400">
            {(postErrorObj as Error).message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-6 transition-all duration-300">
      {post &&
        (isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            {/* Редагування поста */}
            <div className="inline-flex items-center justify-center self-start px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30">
              Редагування поста #{post.id}
            </div>
            {updateMutation.isError && (
              <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg">
                ⚠️ {(updateMutation.error as Error).message}
              </div>
            )}
            {/* Поля редагування */}
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-zinc-800/30"
            />
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              required
              rows={5}
              className="px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-zinc-800/30"
            />
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg"
              >
                {updateMutation.isPending ? "Збереження..." : "Зберегти 💾"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 rounded-lg"
              >
                Скасувати
              </button>
            </div>
          </form>
        ) : (
          <article className="flex flex-col gap-4">
            {/* Перегляд поста */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30">
                Пост #{post.id}
              </div>
              <button
                onClick={() => {
                  setEditTitle(post.title);
                  setEditBody(post.body);
                  setIsEditing(true);
                }}
                className="px-3 py-1 text-xs font-medium text-violet-600 border rounded-lg"
              >
                Редагувати ✏️
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">{post.title}</h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300">
              {post.body}
            </p>
          </article>
        ))}

      {author && (
        <div className="flex flex-col gap-4 pt-6 border-t mt-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase">
            Інформація про автора
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base">{author.name}</h3>
              <p className="text-xs sm:text-sm text-slate-500 truncate">
                @{author.username} • {author.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

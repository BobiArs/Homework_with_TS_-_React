import { useForm } from "react-hook-form";
import type { PostDTO } from "../types/api.types";
import { createPost } from "../api/postsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface formData {
  title: string;
  body: string;
}

export default function NewPostForm({
  onAddPost,
}: {
  onAddPost: (post: PostDTO) => void;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formData>();

  const mutation = useMutation({
    mutationFn: (data: formData) => createPost({ ...data, userId: 1 }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onAddPost(res);
      reset();
    },

    //І щоб працювало додавання як тре
    // onSuccess: (newPost) => {
    //   queryClient.setQueryData<PostDTO[]>(["posts"], (oldPosts) => {
    //     return oldPosts ? [newPost, ...oldPosts] : [newPost];
    //   });
    //   onAddPost(newPost);
    //   reset();
    // },
  });

  const onSubmit = (data: formData) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-5 transition-colors duration-300"
    >
      <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 m-0">
        Створити новий пост
      </h2>

      {/* Заголовок */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
          Заголовок
        </label>
        <input
          type="text"
          placeholder="Назва вашого нового поста..."
          {...register("title", {
            required: "Заголовок обов’язковий",
            minLength: { value: 3, message: "Мінімум 3 символи" },
          })}
          className={`px-4 py-2.5 rounded-xl border ${
            errors.title
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-100 dark:border-zinc-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          }`}
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">⚠️ {errors.title.message}</p>
        )}
      </div>

      {/* Текст поста */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
          Текст поста
        </label>
        <textarea
          placeholder="Напишіть щось цікаве..."
          rows={3}
          {...register("body", {
            required: "Текст обов’язковий",
            minLength: { value: 10, message: "Мінімум 10 символів" },
          })}
          className={`px-4 py-2.5 rounded-xl border resize-y min-h-[80px] ${
            errors.body
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-100 dark:border-zinc-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          }`}
        />
        {errors.body && (
          <p className="text-xs text-red-500 mt-1">⚠️ {errors.body.message}</p>
        )}
      </div>

      {/* Кнопка */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-2.5 px-4 bg-violet-600 dark:bg-violet-500 hover:bg-violet-700 dark:hover:bg-violet-600 text-white font-medium rounded-xl shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.isPending ? "Створюється..." : "Створити пост ✍️"}
      </button>

      {/* Повідомлення */}
      {mutation.isSuccess && (
        <div className="p-3.5 rounded-xl border bg-green-50 text-green-800 text-sm">
          ✅ Пост успішно створено з ID: {mutation.data?.id}
        </div>
      )}
      {mutation.isError && (
        <div className="p-3.5 rounded-xl border bg-red-50 text-red-800 text-sm">
          ❌ Не вдалось створити пост: {(mutation.error as Error).message}
        </div>
      )}
    </form>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiClient } from "../utils/api";

interface formData {
  title: string;
  body: string;
}

export default function NewPostForm({
  onAddPost,
}: {
  onAddPost: (post: formData & { id: number }) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<formData>();

  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const onSubmit = async (data: formData) => {
    try {
      setStatus(null);
      const result = await apiClient<formData & { id: number }>("/posts", {
        method: "POST",
        body: JSON.stringify(data),
      });

      onAddPost({ ...data, id: result.id });
      setStatus({
        type: "success",
        text: `Пост успішно створено з ID: ${result.id}!`,
      });
      reset();
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Виникла помилка при створенні поста";
      setStatus({
        type: "error",
        text: `Не вдалось створити пост: ${errorMsg}`,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-5 transition-colors duration-300"
    >
      <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 m-0">
        Створити новий пост
      </h2>

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
          className={`px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-zinc-800/30 text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none transition-all duration-200 ${
            errors.title
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-100 dark:border-zinc-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          }`}
        />
        {errors.title && (
          <p className="text-xs font-medium text-red-500 mt-1 m-0">
            ⚠️ {errors.title.message}
          </p>
        )}
      </div>

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
          className={`px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-zinc-800/30 text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none resize-y min-h-[80px] transition-all duration-200 ${
            errors.body
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-100 dark:border-zinc-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          }`}
        />
        {errors.body && (
          <p className="text-xs font-medium text-red-500 mt-1 m-0">
            ⚠️ {errors.body.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 bg-violet-600 dark:bg-violet-500 hover:bg-violet-700 dark:hover:bg-violet-600 text-white font-medium rounded-xl shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
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
            Створюється...
          </>
        ) : (
          "Створити пост ✍️"
        )}
      </button>

      {status && (
        <div
          className={`p-3.5 rounded-xl border text-sm flex items-start gap-2.5 transition-all ${
            status.type === "success"
              ? "bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300"
              : "bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300"
          }`}
        >
          <span className="text-base">
            {status.type === "success" ? "✅" : "❌"}
          </span>
          <p className="m-0 font-medium whitespace-pre-line">{status.text}</p>
        </div>
      )}
    </form>
  );
}

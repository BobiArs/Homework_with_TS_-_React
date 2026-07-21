import { deletePost, getPosts } from "../api/postsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface PostsListProps {
  selectedPostId: number | null;
  onSelectedPostId: (id: number | null) => void;
}

export default function PostsList({
  selectedPostId,
  onSelectedPostId,
}: PostsListProps) {
  const queryClient = useQueryClient();
  const {
    data: posts = [],
    isPending,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(10),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      if (selectedPostId === id) {
        onSelectedPostId(null);
      }
    },

    // Варіант щоб видалення праювало
    // onSuccess: (_, deletedId) => {
    //   queryClient.setQueryData<PostDTO[]>(["posts"], (oldPosts) => {
    //     return oldPosts ? oldPosts.filter((post) => post.id !== deletedId) : [];
    //   });
    //   if (selectedPostId === deletedId) {
    //     onSelectedPostId(null);
    //   }
    // },
  });

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-5 transition-colors duration-300 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 m-0">
          Список постів
        </h2>
        {isFetching && (
          <span className="text-xs text-slate-400 dark:text-zinc-500">
            🔄 Оновлення...
          </span>
        )}
      </div>

      {isPending && (
        <div className="text-center py-8 text-slate-400 dark:text-zinc-500">
          Завантаження...
        </div>
      )}

      {isError && (
        <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg">
          ⚠️ {(error as Error).message}
        </div>
      )}

      {posts.length === 0 && !isPending && (
        <div className="text-center py-8 text-slate-400 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
          Немає постів. Створіть новий!
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
                  handleDelete(post.id);
                }}
                disabled={deleteMutation.isPending}
                className="p-2 text-slate-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Видалити пост"
              >
                🗑️
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

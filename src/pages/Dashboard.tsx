import { useState } from "react";
import NewPostForm from "../components/NewPostForm";
import PostsList from "../components/PostsList";
import PostDetails from "../components/PostDetails";
import type { PostDTO } from "../types/api.types";
import { deletePost } from "../api/postsApi";

export default function Dashboard() {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleAddPost = (post: PostDTO) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handleUpdatePost = (updatedPost: PostDTO) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleDeletePost = async (id: number) => {
    try {
      const success = await deletePost(id);

      if (success) {
        setPosts((p) => p.filter((p) => p.id !== id));

        if (selectedPostId === id) {
          setSelectedPostId(null);
        }
      }
    } catch (err) {
      console.error("Не вдалося видалити пост на сервері:", err);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (selectedPostId === id) {
        setSelectedPostId(null);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 text-left transition-colors duration-300">
      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent m-0">
          Панель керування блогом 🚀
        </h1>
        <p className="mt-2 text-slate-500 dark:text-zinc-400 text-sm sm:text-base">
          Керуйте своїми постами, додавайте нові, видаляйте існуючі та
          переглядайте профілі авторів у реальному часі.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ліва частина */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <NewPostForm onAddPost={handleAddPost} />
          <PostsList
            posts={posts}
            selectedPostId={selectedPostId}
            onSelectedPostId={setSelectedPostId}
            onPostsLoaded={setPosts}
            onDeletePost={handleDeletePost}
          />
        </div>

        {/* Права частина */}
        <div className="lg:col-span-7 lg:sticky lg:top-8">
          <PostDetails
            postId={selectedPostId}
            onUpdatePost={handleUpdatePost}
          />
        </div>
      </div>
    </div>
  );
}

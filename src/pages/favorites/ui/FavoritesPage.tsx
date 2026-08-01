import { useState } from "react";
import { Link } from "react-router";
import type { FavoriteActor } from "@/entities/actor";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteActor[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((actor) => actor.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return <p className="text-center font-medium mt-8 text-gray-500">У вас поки немає обраних акторів</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Обрані актори</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((actor) => (
          <div
            key={actor.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center border border-gray-100 hover:shadow-lg transition"
          >
            <Link to={`/actor/${actor.id}`} className="text-center group block">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://placehold.co/200x300/E9D5FF/7C3AED?text=No+Image"
                }
                alt={actor.name}
                className="rounded-lg mb-3 object-cover shadow-sm group-hover:scale-[1.02] transition"
              />
              <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                {actor.name}
              </h3>
            </Link>
            <button
              onClick={() => removeFavorite(actor.id)}
              className="mt-4 bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-650 transition cursor-pointer text-sm font-semibold shadow-sm shadow-red-100"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

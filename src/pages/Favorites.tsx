import { useEffect, useState } from "react";
import { Link } from "react-router";

interface FavoriteActor {
  id: number;
  name: string;
  profile_path?: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteActor[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((actor) => actor.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return <p className="text-center">У вас поки немає обраних акторів</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Обрані актори</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((actor) => (
          <div
            key={actor.id}
            className="bg-white rounded shadow-md p-4 flex flex-col items-center"
          >
            <Link to={`/actor/${actor.id}`} className="text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://placehold.co/200x300/E9D5FF/7C3AED?text=No+Image"
                }
                alt={actor.name}
                className="rounded mb-3"
              />
              <h3 className="text-lg font-semibold">{actor.name}</h3>
            </Link>
            <button
              onClick={() => removeFavorite(actor.id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getActorDetails } from "../api/tmdbApi";
import { Link } from "react-router";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

interface FavoriteActor {
  id: number;
  name: string;
  profile_path?: string;
}

export default function ActorDetails() {
  const { actorId } = useParams<{ actorId: string }>();
  const id = Number(actorId);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    data: actor,
    isLoading: actorLoading,
    isError: actorError,
  } = useQuery({
    queryKey: ["actor", id],
    queryFn: () => getActorDetails(id),
    enabled: !isNaN(id),
  });

  useEffect(() => {
    if (actor) {
      const favorites: FavoriteActor[] = JSON.parse(
        localStorage.getItem("favorites") || "[]",
      );
      setIsFavorite(favorites.some((fav) => fav.id === actor.id));
    }
  }, [actor]);

  const toggleFavorite = () => {
    if (!actor) return;
    const favorites: FavoriteActor[] = JSON.parse(
      localStorage.getItem("favorites") || "[]",
    );
    const newFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== actor.id)
      : [
          ...favorites,
          { id: actor.id, name: actor.name, profile_path: actor.profile_path },
        ];
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  if (actorLoading) return <p className="text-center">Завантаження...</p>;
  if (actorError)
    return (
      <p className="text-center text-red-500">Помилка завантаження актора</p>
    );
  if (!actor) return <p className="text-center">Актора не знайдено</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-purple-600 hover:underline mb-6 font-semibold"
      >
        &larr; Назад
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
          alt={actor.name}
          className="rounded-lg shadow-lg w-full md:w-1/3"
        />
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold">{actor.name}</h2>
          <p className="mt-2 text-sm text-gray-500">
            Дата народження: {actor.birthday || "невідомо"}
          </p>
          {actor.place_of_birth && (
            <p className="text-sm text-gray-500">
              Місце народження: {actor.place_of_birth}
            </p>
          )}
          <p className="text-gray-700 mt-4">
            {actor.biography || "Біографія відсутня."}
          </p>
          <button
            onClick={toggleFavorite}
            className={`mt-4 px-4 py-2 rounded font-semibold text-white transition ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isFavorite ? "Видалити з обраного" : "Додати в обране"}
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Фільмографія</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {actor.movie_credits.cast.map((movie: Movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="text-center"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "https://placehold.co/200x300/E9D5FF/7C3AED?text=No+Image"
                }
                alt={movie.title}
                className="rounded shadow-md hover:shadow-lg transition-shadow"
              />
              <p className="text-sm mt-2 font-medium">{movie.title}</p>
              <p className="text-xs text-gray-500">
                {movie.release_date?.split("-")[0]}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

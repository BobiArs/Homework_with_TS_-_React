import { useNavigate, useLoaderData, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { actorQueries } from "@/entities/actor";
import type { Movie, FavoriteActor } from "@/entities/actor";
import { isSessionActive } from "@/entities/session";
import { useState } from "react";

export default function ActorDetailsPage() {
  const { actorId } = useLoaderData() as { actorId: number };
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<FavoriteActor[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const {
    data: actor,
    isLoading: actorLoading,
    isError: actorError,
  } = useQuery(actorQueries.detail(actorId));

  const isFavorite = actor ? favorites.some((fav) => fav.id === actor.id) : false;

  const toggleFavorite = () => {
    if (!isSessionActive()) {
      alert(
        "Будь ласка, увійдіть у систему, щоб додавати акторів до обраного."
      );
      return;
    }

    if (!actor) return;
    const newFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== actor.id)
      : [
          ...favorites,
          { id: actor.id, name: actor.name, profile_path: actor.profile_path },
        ];
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  if (actorLoading) return <p className="text-center font-medium mt-8 text-gray-500">Завантаження...</p>;
  if (actorError)
    return (
      <p className="text-center font-medium mt-8 text-red-500">Помилка завантаження актора</p>
    );
  if (!actor) return <p className="text-center font-medium mt-8 text-gray-500">Актора не знайдено</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-purple-600 hover:underline mb-6 font-semibold cursor-pointer"
      >
        &larr; Назад
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
          alt={actor.name}
          className="rounded-lg shadow-lg w-full md:w-1/3 object-cover"
        />
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-905">{actor.name}</h2>
          <p className="mt-2 text-sm text-gray-550">
            Дата народження: {actor.birthday || "невідомо"}
          </p>
          {actor.place_of_birth && (
            <p className="text-sm text-gray-550">
              Місце народження: {actor.place_of_birth}
            </p>
          )}
          <p className="text-gray-700 mt-4 leading-relaxed">
            {actor.biography || "Біографія відсутня."}
          </p>
          <button
            onClick={toggleFavorite}
            className={`mt-6 px-4 py-2.5 rounded-lg font-bold text-white transition cursor-pointer shadow ${
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
        <h3 className="text-xl font-bold text-gray-900 mb-4">Фільмографія</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {actor.movie_credits?.cast?.map((movie: Movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="text-center group block"
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
              <p className="text-sm mt-2 font-semibold group-hover:text-purple-650 transition-colors truncate">
                {movie.title}
              </p>
              <p className="text-xs text-gray-500">
                {movie.release_date ? movie.release_date.split("-")[0] : ""}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

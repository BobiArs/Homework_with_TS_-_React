import { useQuery } from "@tanstack/react-query";
import { getActorDetails, getActorMovies } from "../api/tmdbApi";

interface ActorDetailsModalProps {
  personId: number | null;
  onClose: () => void;
}

const imgBaseUrl = "https://image.tmdb.org/t/p/w300";
const fallbackImg = "https://via.placeholder.com/300x450?text=No+Image";

export default function ActorDetailsModal({
  personId,
  onClose,
}: ActorDetailsModalProps) {
  const {
    data: actor,
    isPending: actorLoading,
    isError: actorError,
  } = useQuery({
    queryKey: ["actor", personId],
    queryFn: () => getActorDetails(personId!),
    enabled: !!personId,
    staleTime: 1000 * 60 * 10,
  });

  const {
    data: movies,
    isPending: moviesLoading,
    isError: moviesError,
  } = useQuery({
    queryKey: ["actorMovies", personId],
    queryFn: () => getActorMovies(personId!),
    enabled: !!personId,
  });

  if (!personId) return null;
  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 md:p-8 shadow-2xl flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закриття */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition"
        >
          &times;
        </button>

        {/* Стан завантаження */}
        {(actorLoading || moviesLoading) && (
          <p className="text-center text-gray-500">Завантаження...</p>
        )}

        {/* Помилка */}
        {(actorError || moviesError) && (
          <p className="text-center text-red-500">
            Не вдалося завантажити дані 😔
          </p>
        )}

        {/* Основна інформація */}
        {actor && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img
              src={
                actor.profile_path
                  ? `${imgBaseUrl}${actor.profile_path}`
                  : fallbackImg
              }
              alt={actor.name}
              className="rounded-lg w-full h-auto shadow-md"
            />

            <div className="md:col-span-2 space-y-4">
              <h2 className="text-3xl font-extrabold text-gray-900">
                {actor.name}
              </h2>

              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <span>🎂 Дата народження: {actor.birthday || "Невідомо"}</span>
                <span>
                  📍 Місце народження: {actor.place_of_birth || "Невідомо"}
                </span>
              </div>

              <div>
                <h3 className="text-md font-bold text-gray-800">Біографія</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {actor.biography || "Біографія відсутня"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Фільмографія */}
        {movies && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Відомі роботи (Фільмографія)
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {movies.cast.slice(0, 6).map((movie: any) => (
                <div key={movie.id} className="text-center">
                  <div className="w-full h-[120px] bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                    {movie.poster_path ? (
                      <img
                        src={`${imgBaseUrl}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      "Постер відсутній"
                    )}
                  </div>
                  <p className="font-bold text-xs mt-1.5 line-clamp-1">
                    {movie.title}
                  </p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">
                    {movie.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

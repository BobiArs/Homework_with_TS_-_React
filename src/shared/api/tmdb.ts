import { api } from "./base";
import type {
  TMDBMovie,
  WatchProviderResponse,
  MovieVideo,
  CastMember,
  Genre,
} from "./types";

export type {
  TMDBMovie,
  WatchProvider,
  MovieVideo,
  CastMember,
  Genre,
} from "./types";

// Отримання списку офіційних жанрів
export const fetchGenres = async (): Promise<Genre[]> => {
  const response = await api.get<{ genres: Genre[] }>("/genre/movie/list", {
    params: { language: "uk-UA" },
  });
  return response.data.genres;
};

// Запит для вибору випадкових фільмів на основі фільтрів
interface DiscoverParams {
  with_genres?: string; // ID жанрів через кому
  "primary_release_date.gte"?: string; // Початковий рік (РРРР-ММ-ДД)
  "primary_release_date.lte"?: string; // Кінцевий рік (РРРР-ММ-ДД)
  "with_runtime.lte"?: number; // Максимальний хронометраж
  "with_runtime.gte"?: number; // Мінімальний хронометраж
}

export const discoverMovies = async (
  params: DiscoverParams,
): Promise<TMDBMovie[]> => {
  const response = await api.get<{ results: TMDBMovie[] }>("/discover/movie", {
    params: {
      ...params,
      language: "uk-UA",
      region: "UA",
      sort_by: "popularity.desc",
      include_adult: false,
      page: 1, // Завантажуємо першу (найпопулярнішу) сторінку результатів
    },
  });
  return response.data.results;
};

// Отримання трейлерів до фільму
export const fetchMovieVideos = async (
  movieId: number,
): Promise<MovieVideo[]> => {
  const response = await api.get<{ results: MovieVideo[] }>(
    `/movie/${movieId}/videos`,
  );
  // Повертаємо лише YouTube-трейлери
  return response.data.results.filter(
    (video) =>
      video.site.toLowerCase() === "youtube" &&
      video.type.toLowerCase() === "trailer",
  );
};

// Отримання списку сервісів стрімінгу
export const fetchWatchProviders = async (
  movieId: number,
  countryCode = "UA",
): Promise<WatchProviderResponse["results"][string] | null> => {
  try {
    const response = await api.get<WatchProviderResponse>(
      `/movie/${movieId}/watch/providers`,
    );
    return response.data.results[countryCode.toUpperCase()] || null;
  } catch (e) {
    console.error("Watch providers not found", e);
    return null;
  }
};

// Отримання акторського складу
export const fetchMovieCredits = async (
  movieId: number,
): Promise<CastMember[]> => {
  const response = await api.get<{ cast: CastMember[] }>(
    `/movie/${movieId}/credits`,
    {
      params: { language: "uk-UA" },
    },
  );
  return response.data.cast.slice(0, 5); // обмежуємося топ-5 акторів
};

// Допоміжний метод формування посилання на зображення
export const getImageUrl = (path: string | null, size = "w500") => {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

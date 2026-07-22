import axios from "axios";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
    authorization: `Bearer ${ACCESS_TOKEN}`,
  },
  params: {
    language: "uk-UA",
  },
});

// Популярні актори
export const getPopularActors = async (page = 1) => {
  const response = await tmdbApi.get("/person/popular", {
    params: {
      page,
    },
  });
  return response.data;
};

// Пошук акторів
export const searchActors = async (query: string, page = 1) => {
  const response = await tmdbApi.get("/search/person", {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

// Деталі Актора
export const getActorDetails = async (personId: number) => {
  const response = await tmdbApi.get(`/person/${personId}`);
  return response.data;
};

// Фільмографія актора
export const getActorMovies = async (personId: number) => {
  const response = await tmdbApi.get(`/person/${personId}/movie_credits`);
  return response.data;
};

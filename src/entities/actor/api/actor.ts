import { tmdbApi } from "@/shared/api";
import type { Actor, ActorDetails, MovieCredits } from "../model/types";

// Популярні актори
export const getPopularActors = async (
  page = 1,
): Promise<{ results: Actor[]; total_pages: number }> => {
  const response = await tmdbApi.get("/person/popular", {
    params: {
      page,
    },
  });
  return response.data;
};

// Пошук акторів
export const searchActors = async (
  query: string,
  page = 1,
): Promise<{ results: Actor[]; total_pages: number }> => {
  const response = await tmdbApi.get("/search/person", {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

// Деталі Актора
export const getActorDetails = async (
  personId: number,
): Promise<ActorDetails> => {
  const response = await tmdbApi.get(`/person/${personId}`);
  return response.data;
};

// Фільмографія актора
export const getActorMovies = async (
  personId: number,
): Promise<MovieCredits> => {
  const response = await tmdbApi.get(`/person/${personId}/movie_credits`);
  return response.data;
};

// Конфігурація React Query (без лоадерів маршрутизації!)
export const actorQueries = {
  popular: (page: number) => ({
    queryKey: ["actors", "", page],
    queryFn: () => getPopularActors(page),
  }),
  search: (query: string, page: number) => ({
    queryKey: ["actors", query, page],
    queryFn: () => searchActors(query, page),
  }),
  detail: (id: number) => ({
    queryKey: ["actor", id],
    queryFn: () => getActorDetails(id),
    enabled: !isNaN(id),
  }),
};

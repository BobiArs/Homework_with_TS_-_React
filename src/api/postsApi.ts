import type { AxiosRequestConfig } from "axios";
import type { PostDTO } from "../types/api.types";
import { apiClient } from "./apiClient";

// Отриммати список постів
export const getPosts = async (limit?: number) => {
  const response = await apiClient.get<PostDTO[]>(`/posts`, {
    params: {
      _limit: limit ?? 10,
    },
  });
  return response.data;
};

// Отримати конкретний пост
export const getPostById = async (id: number, config?: AxiosRequestConfig) => {
  const response = await apiClient.get<PostDTO>(`/posts/${id}`, config);
  return response.data;
};

// Створити новий пост
// Omit - потрібен щоб виключити параметр id для данної функції з інтерфейсу PostDTO
export const createPost = async (payload: Omit<PostDTO, "id">) => {
  const response = await apiClient.post<PostDTO>(`/posts`, payload);
  return response.data;
};

// Видалення поста
export const deletePost = async (id: number) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.status === 200;
};

// Оновлення поста
// Partial - робить параметри в PostDTO необовязковими(T), це як кожен параметр може бути ? (=0)
export const updatePost = async (id: number, payload: Partial<PostDTO>) => {
  const response = await apiClient.patch<PostDTO>(`/posts/${id}`, payload);
  return response.data;
};

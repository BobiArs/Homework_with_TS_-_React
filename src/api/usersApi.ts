import type { AxiosRequestConfig } from "axios";
import type { UserDTO } from "../types/api.types";
import { apiClient } from "./apiClient";

// Отримати користувача з парамтра ID в UserDTO
export const getUserById = async (id: number, config?: AxiosRequestConfig) => {
  const response = await apiClient.get<UserDTO>(`/users/${id}`, config);
  return response.data;
};

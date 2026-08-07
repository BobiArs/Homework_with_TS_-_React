import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: "application/json",
  },
});

// Додаємо інтерцептор для авторизації за допомогою Bearer Token
api.interceptors.request.use((config) => {
  // Намагаємось отримати токен з localStorage або з середовища (env)
  const token =
    localStorage.getItem("tmdb_access_token") ||
    import.meta.env.VITE_TMDB_ACCESS_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

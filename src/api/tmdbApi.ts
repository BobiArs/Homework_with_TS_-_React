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
    append_to_response: "movie_credits",
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

// Отримання тимчасового токена запиту
export const getRequestToken = async () => {
  const response = await tmdbApi.get("/authentication/token/new");
  return response.data.request_token;
};

// Валідація токена за допомогою логіна й пароля
export const validateTokenWithLogin = async (
  username: string,
  password: string,
  requestToken: string,
) => {
  const response = await tmdbApi.post(
    "/authentication/token/validate_with_login",
    {
      username,
      password,
      request_token: requestToken,
    },
  );
  return response.data.request_token;
};

// Створення сесії
export const createSessionId = async (requestToken: string) => {
  const response = await tmdbApi.post("/authentication/session/new", {
    request_token: requestToken,
  });
  return response.data.session_id;
};

// Функція-хелпер для швидкого входу
export const loginUser = async (username: string, password: string) => {
  const token = await getRequestToken();
  const validatedToken = await validateTokenWithLogin(
    username,
    password,
    token,
  );
  const sessionId = await createSessionId(validatedToken);
  return sessionId;
};

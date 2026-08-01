import { tmdbApi } from "@/shared/api";

// Отримання тимчасового токена запиту
export const getRequestToken = async (): Promise<string> => {
  const response = await tmdbApi.get("/authentication/token/new");
  return response.data.request_token;
};

// Валідація токена за допомогою логіна й пароля
export const validateTokenWithLogin = async (
  username: string,
  password: string,
  requestToken: string,
): Promise<string> => {
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
export const createSessionId = async (requestToken: string): Promise<string> => {
  const response = await tmdbApi.post("/authentication/session/new", {
    request_token: requestToken,
  });
  return response.data.session_id;
};

// Функція-хелпер для швидкого входу
export const loginUser = async (username: string, password: string): Promise<string> => {
  const token = await getRequestToken();
  const validatedToken = await validateTokenWithLogin(
    username,
    password,
    token,
  );
  const sessionId = await createSessionId(validatedToken);
  return sessionId;
};

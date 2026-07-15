const BASE_URL = "https://jsonplaceholder.typicode.com";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      searchParams.append(key, String(val));
    });
    url += `?${searchParams.toString()}`;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customConfig.headers,
  };

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(
      `Помилка запиту: ${response.statusText} (код: ${response.status})`,
    );
  }

  return response.json();
}

# Крок 2: Інтеграція з TMDB API

На цьому етапі розробки ми створимо типи даних для фільмів та стрімінгових платформ, налаштуємо Axios клієнт для авторизації та реалізуємо методи для отримання даних з TMDB API.

---

## 1. Визначення типів даних (`src/shared/api/types.ts`)

Створіть файл `types.ts` в папці `src/shared/api/` для забезпечення типізації відповідей з сервера TMDB:

```typescript
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviderResponse {
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}

export interface MovieVideo {
  id: string;
  key: string; // YouTube відео ID
  name: string;
  site: string; // Зазвичай "YouTube"
  type: string; // Наприклад, "Trailer", "Teaser"
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}
```

---

## 2. Створення Axios-клієнта (`src/shared/api/base.ts`)

Створіть файл `base.ts` в папці `src/shared/api/`. Він налаштовує базований екземпляр Axios, який автоматично додає ваш Read Access Token (Bearer Token) до всіх запитів. 

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
  },
});

// Додаємо інтерцептор для авторизації за допомогою Bearer Token
api.interceptors.request.use((config) => {
  // Намагаємось отримати токен з localStorage або з середовища (env)
  const token = localStorage.getItem('tmdb_access_token') || import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 3. Створення сервісу запитів до TMDB (`src/shared/api/tmdb.ts`)

Створіть файл `tmdb.ts` в папці `src/shared/api/` для опису всіх необхідних запитів:

```typescript
import { api } from './base';
import type { TMDBMovie, WatchProviderResponse, MovieVideo, CastMember, Genre } from './types';

export type { TMDBMovie, WatchProvider, MovieVideo, CastMember, Genre } from './types';

// Отримання списку офіційних жанрів
export const fetchGenres = async (): Promise<Genre[]> => {
  const response = await api.get<{ genres: Genre[] }>('/genre/movie/list', {
    params: { language: 'uk-UA' },
  });
  return response.data.genres;
};

// Запит для вибору випадкових фільмів на основі фільтрів
interface DiscoverParams {
  with_genres?: string; // ID жанрів через кому
  'primary_release_date.gte'?: string; // Початковий рік (РРРР-ММ-ДД)
  'primary_release_date.lte'?: string; // Кінцевий рік (РРРР-ММ-ДД)
  'with_runtime.lte'?: number; // Максимальний хронометраж
  'with_runtime.gte'?: number; // Мінімальний хронометраж
}

export const discoverMovies = async (params: DiscoverParams): Promise<TMDBMovie[]> => {
  const response = await api.get<{ results: TMDBMovie[] }>('/discover/movie', {
    params: {
      ...params,
      language: 'uk-UA',
      region: 'UA',
      sort_by: 'popularity.desc',
      include_adult: false,
      page: 1, // Завантажуємо першу (найпопулярнішу) сторінку результатів
    },
  });
  return response.data.results;
};

// Отримання трейлерів до фільму
export const fetchMovieVideos = async (movieId: number): Promise<MovieVideo[]> => {
  const response = await api.get<{ results: MovieVideo[] }>(`/movie/${movieId}/videos`);
  // Повертаємо лише YouTube-трейлери
  return response.data.results.filter(
    (video) => video.site.toLowerCase() === 'youtube' && video.type.toLowerCase() === 'trailer'
  );
};

// Отримання списку сервісів стрімінгу
export const fetchWatchProviders = async (
  movieId: number,
  countryCode = 'UA'
): Promise<WatchProviderResponse['results'][string] | null> => {
  try {
    const response = await api.get<WatchProviderResponse>(`/movie/${movieId}/watch/providers`);
    return response.data.results[countryCode.toUpperCase()] || null;
  } catch (e) {
    console.error('Watch providers not found', e);
    return null;
  }
};

// Отримання акторського складу
export const fetchMovieCredits = async (movieId: number): Promise<CastMember[]> => {
  const response = await api.get<{ cast: CastMember[] }>(`/movie/${movieId}/credits`, {
    params: { language: 'uk-UA' },
  });
  return response.data.cast.slice(0, 5); // обмежуємося топ-5 акторів
};

// Допоміжний метод формування посилання на зображення
export const getImageUrl = (path: string | null, size = 'w500') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
```

---

## 4. Створення загального експорту (`src/shared/api/index.ts`)

Створіть файл `index.ts` в папці `src/shared/api/` для публічного експорту:

```typescript
export * from './tmdb';
export * from './types';
```

Спільний рівень API повністю реалізовано. Наступний крок — розробка інтерактивного компонента рулетки на базі HTML5 Canvas.

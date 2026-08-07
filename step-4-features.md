# Крок 4: Фільтрація та картка фільму

На цьому етапі ми розробимо дві інтерактивні фічі у шарі `features`:
1. **Панель фільтрації (`FilterPanel`)** — мапінг емоцій користувача на реальні ID жанрів TMDB, обмеження за хронометражем та роком випуску.
2. **Модальне вікно деталей фільму (`MovieDetailsModal`)** — відображення деталей вибраного фільму, вбудованого YouTube-трейлера та списку стрімінгових сервісів.

---

## 1. Створення панелі фільтрації (`src/features/movie-filter/ui/FilterPanel.tsx`)

Створіть директорію `src/features/movie-filter/ui/` та додайте файл `FilterPanel.tsx`:

```tsx
import React from 'react';

export type MoodType = 'joyful' | 'tense' | 'romantic' | 'epic';
export type RuntimeType = 'short' | 'medium' | 'any';
export type EraType = 'classic' | 'modern' | 'recent' | 'any';

export interface FilterState {
  mood: MoodType;
  runtime: RuntimeType;
  era: EraType;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {
  const setMood = (mood: MoodType) => onChange({ ...filters, mood });
  const setRuntime = (runtime: RuntimeType) => onChange({ ...filters, runtime });
  const setEra = (era: EraType) => onChange({ ...filters, era });

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border/60 rounded-3xl p-6 shadow-2xl space-y-6">
      <h2 className="text-xl font-bold tracking-wide text-secondary text-glow-secondary">
        Налаштуйте кіно-коктейль
      </h2>

      {/* Фільтр: Настрій (мапиться на ID жанрів) */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
          Який у вас настрій?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'joyful', label: '😂 Веселий', desc: 'Комедії та анімація' },
              { id: 'tense', label: '🍿 Напружений', desc: 'Трилери та жахи' },
              { id: 'romantic', label: '💖 Романтичний', desc: 'Мелодрами та драми' },
              { id: 'epic', label: '🚀 Епічний', desc: 'Пригоди та фантастика' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all duration-200 ${
                filters.mood === m.id
                  ? 'bg-primary/10 border-primary text-primary text-glow-primary'
                  : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <div className="text-sm font-bold">{m.label}</div>
              <div className="text-[10px] opacity-75 mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Фільтр: Тривалість */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
          Хронометраж
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'short', label: '⚡ Швидкий', desc: '< 90 хв' },
              { id: 'medium', label: '🍿 Стандарт', desc: '90-130 хв' },
              { id: 'any', label: '🎬 Будь-який', desc: 'Без лімітів' },
            ] as const
          ).map((r) => (
            <button
              key={r.id}
              onClick={() => setRuntime(r.id)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                filters.runtime === r.id
                  ? 'bg-secondary/10 border-secondary text-secondary text-glow-secondary'
                  : 'border-border/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="text-xs font-bold">{r.label}</div>
              <div className="text-[9px] opacity-75 mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Фільтр: Епоха */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
          Епоха кінематографу
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'classic', label: '📻 Класика', desc: 'До 2000 року' },
              { id: 'modern', label: '🎞 Сучасне', desc: '2000 - 2015 роки' },
              { id: 'recent', label: '🔥 Новинки', desc: 'Після 2016 року' },
              { id: 'any', label: '🌍 Всі роки', desc: 'Будь-який рік' },
            ] as const
          ).map((e) => (
            <button
              key={e.id}
              onClick={() => setEra(e.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                filters.era === e.id
                  ? 'bg-accent/10 border-accent/60 text-accent text-glow-accent'
                  : 'border-border/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="text-xs font-bold">{e.label}</div>
              <div className="text-[9px] opacity-75 mt-0.5">{e.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 2. Створення картки результату (`src/features/movie-details/ui/MovieDetailsModal.tsx`)

Створіть директорію `src/features/movie-details/ui/` та додайте файл `MovieDetailsModal.tsx`. 

Ми використаємо діалог від `@/shared/ui/dialog` (shadcn) та зробимо запити на трейлер та Watch Providers з використанням `@tanstack/react-query`:

```tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';
import { fetchMovieVideos, fetchWatchProviders, fetchMovieCredits, getImageUrl } from '@/shared/api/tmdb';
import type { TMDBMovie } from '@/shared/api/types';

interface MovieDetailsModalProps {
  movie: TMDBMovie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  isOpen,
  onClose,
}) => {
  if (!movie) return null;

  // Отримання трейлера
  const { data: videos } = useQuery({
    queryKey: ['movie-videos', movie.id],
    queryFn: () => fetchMovieVideos(movie.id),
    enabled: !!movie.id,
  });

  // Отримання стрімінгів
  const { data: watchProviders } = useQuery({
    queryKey: ['movie-providers', movie.id],
    queryFn: () => fetchWatchProviders(movie.id, 'UA'),
    enabled: !!movie.id,
  });

  // Отримання акторів
  const { data: cast } = useQuery({
    queryKey: ['movie-cast', movie.id],
    queryFn: () => fetchMovieCredits(movie.id),
    enabled: !!movie.id,
  });

  const trailer = videos?.[0]; // беремо перший знайдений трейлер
  const flatrateProviders = watchProviders?.flatrate || []; // стрімінг за передплатою

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card border border-border/80 text-foreground rounded-3xl overflow-y-auto max-h-[90vh] shadow-neon-primary/20">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-black text-primary text-glow-primary">
            🎉 Ваш випадковий фільм!
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ось що підібрала для вас рулетка
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Трейлер або заставка */}
          {trailer ? (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title="Movie Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : movie.backdrop_path ? (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border bg-background/50">
              <img
                src={getImageUrl(movie.backdrop_path, 'w780')}
                alt="Постер фільму"
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

          {/* Інформація про фільм */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Постер */}
            <div className="hidden md:block aspect-[2/3] rounded-2xl overflow-hidden border border-border bg-background/30">
              {movie.poster_path ? (
                <img
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground text-center">
                  Немає постера
                </div>
              )}
            </div>

            {/* Опис та деталі */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground leading-tight">{movie.title}</h3>
                <span className="text-xs text-muted-foreground capitalize">
                  {movie.original_title} ({movie.release_date.split('-')[0]})
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <span className="bg-accent/10 border border-accent/30 text-accent font-black text-xs px-2.5 py-0.5 rounded-full text-glow-accent">
                    ⭐ {movie.vote_average.toFixed(1)} / 10
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">{movie.overview || 'Опис фільму відсутній українською мовою.'}</p>
            </div>
          </div>

          {/* Актори */}
          {cast && cast.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">У головних ролях</span>
              <div className="flex flex-wrap gap-2">
                {cast.map((c) => (
                  <div key={c.id} className="bg-background border border-border px-3 py-1 rounded-xl text-xs font-semibold text-foreground">
                    {c.name} <span className="text-[10px] text-muted-foreground ml-1">({c.character})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Провайдери стрімінгу */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Де подивитися в Україні:
            </span>
            {flatrateProviders.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {flatrateProviders.map((provider) => (
                  <div
                    key={provider.provider_id}
                    className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-2xl hover:border-secondary/40 transition-colors"
                  >
                    <img
                      src={getImageUrl(provider.logo_path, 'w92')}
                      alt={provider.provider_name}
                      className="w-6 h-6 rounded-lg object-contain"
                    />
                    <span className="text-xs font-bold">{provider.provider_name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Не знайдено активних сервісів стрімінгу для України. Перевірте оренду чи купівлю.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

## 3. Публічні точки входу (Public APIs) для фіч

Для кожної фічі створимо файл `index.ts`, щоб інші частини додатку могли імпортувати компоненти через чистий шлях.

### 3.1. Точка входу для фільтрації (`src/features/movie-filter/index.ts`)
Створіть файл `src/features/movie-filter/index.ts`:

```typescript
export { FilterPanel } from "./ui/FilterPanel";
export type { FilterState } from "./ui/FilterPanel";
```

### 3.2. Точка входу для деталей фільму (`src/features/movie-details/index.ts`)
Створіть файл `src/features/movie-details/index.ts`:

```typescript
export { MovieDetailsModal } from "./ui/MovieDetailsModal";
```

---

Ми створили компоненти фільтрації, картку фільму та відповідні файли публічних експортів. Наступний крок — зібрати все разом на головній сторінці, налаштувати роутинг та React Query.

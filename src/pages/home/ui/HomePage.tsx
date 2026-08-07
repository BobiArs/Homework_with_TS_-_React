// HomePage - тут знаходиться логіка мапінгу фільтрів у параметри TMDB, запуск спіннера та вибір випадкового фільму

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FilterPanel } from "@/features/movie-filter";
import type { FilterState } from "@/features/movie-filter";
import { RouletteWheel } from "@/shared/ui";
import { MovieDetailsModal } from "@/features/movie-details";
import { discoverMovies } from "@/shared/api";
import type { TMDBMovie } from "@/shared/api";
import { Button } from "@/shared/ui/button";

export const HomePage: React.FC = () => {
  const queryClient = useQueryClient();

  // Налаштування фільтрів за замовчуванням
  const [filters, setFilters] = useState<FilterState>({
    mood: "joyful",
    runtime: "any",
    era: "any",
  });

  const [moviesList, setMoviesList] = useState<TMDBMovie[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Допоміжна функція мапінгу фільтрів на API параметри TMDB
  const buildApiParams = (f: FilterState) => {
    const params: Parameters<typeof discoverMovies>[0] = {};

    // 1. Мапінг настрою на ID жанрів
    if (f.mood === "joyful")
      params.with_genres = "35,16"; // Комедія, Анімація
    else if (f.mood === "tense")
      params.with_genres = "53,9648,27"; // Трилер, Детектив, Жахи
    else if (f.mood === "romantic")
      params.with_genres = "10749,18"; // Мелодрама, Драма
    else if (f.mood === "epic") params.with_genres = "28,12,878"; // Бойовик, Пригоди, Фантастика

    // 2. Хронометраж
    if (f.runtime === "short") params["with_runtime.lte"] = 90;
    else if (f.runtime === "medium") {
      params["with_runtime.gte"] = 90;
      params["with_runtime.lte"] = 130;
    }

    // 3. Епоха виходу фільму
    if (f.era === "classic") params["primary_release_date.lte"] = "1999-12-31";
    else if (f.era === "modern") {
      params["primary_release_date.gte"] = "2000-01-01";
      params["primary_release_date.lte"] = "2015-12-31";
    } else if (f.era === "recent") {
      params["primary_release_date.gte"] = "2016-01-01";
    }

    return params;
  };

  const handleStartSpin = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setSelectedMovie(null);

    try {
      const params = buildApiParams(filters);
      // Робимо динамічний запит до TMDB API
      const movies = await queryClient.fetchQuery({
        queryKey: ["discover-movies", filters],
        queryFn: () => discoverMovies(params),
        staleTime: 60 * 1000,
      });

      if (!movies || movies.length === 0) {
        setErrorMsg(
          "Фільми за вашими фільтрами не знайдені. Спробуйте змінити критерії пошуку.",
        );
        setIsLoading(false);
        return;
      }

      // Беремо топ-12 популярних фільмів для сегментів колеса
      const candidates = movies.slice(0, 12);
      setMoviesList(candidates);
      setIsLoading(false);

      // Запускаємо анімацію колеса
      setIsSpinning(true);
    } catch (e) {
      console.error(e);
      setErrorMsg(
        "Помилка з'єднання з TMDB. Перевірте налаштування токена або інтернет.",
      );
      setIsLoading(false);
    }
  };

  const handleSpinComplete = (winningIndex: number) => {
    setIsSpinning(false);
    const win = moviesList[winningIndex];
    if (win) {
      setSelectedMovie(win);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 max-w-6xl mx-auto space-y-8">
      {/* Шапка */}
      <header className="text-center mt-6 space-y-2">
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent text-glow-primary uppercase animate-pulse">
          🎬 MovieRoulette
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Оберіть настрій та довіртеся долі! Ми підберемо ідеальне кіно на
          вечір.
        </p>
      </header>

      {/* Головний блок */}
      <main className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Фільтри */}
        <section className="space-y-4">
          <FilterPanel filters={filters} onChange={setFilters} />

          <Button
            onClick={handleStartSpin}
            disabled={isLoading || isSpinning}
            className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-black text-base rounded-2xl text-white shadow-neon-primary/20 hover:shadow-neon-primary/45 transition-all duration-300"
          >
            {isLoading
              ? "Завантаження фільмів..."
              : "🔮 Скласти колесо та обертати!"}
          </Button>

          {errorMsg && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-2xl text-xs text-destructive font-semibold text-center leading-normal">
              ⚠️ {errorMsg}
            </div>
          )}
        </section>

        {/* Рулетка */}
        <section className="flex flex-col items-center justify-center space-y-4">
          <RouletteWheel
            items={moviesList.map((m) => m.title)}
            isSpinning={isSpinning}
            onSpinComplete={handleSpinComplete}
          />
          {moviesList.length > 0 && !isSpinning && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground animate-bounce mt-2">
              ▲ Вказівник рулетки зверху
            </span>
          )}
        </section>
      </main>

      {/* Результат */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <footer className="text-center text-muted-foreground text-[10px] pb-4">
        MovieRoulette &copy; {new Date().getFullYear()}. Розроблено на базі TMDB
        API.
      </footer>
    </div>
  );
};

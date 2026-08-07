// MovieDetailsModal - відображення деталей вибраного фільму, вбудованого YouTube-трейлера та списку стрімінгових сервісів.

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import {
  fetchMovieVideos,
  fetchWatchProviders,
  fetchMovieCredits,
  getImageUrl,
} from "@/shared/api/tmdb";
import type { TMDBMovie } from "@/shared/api/types";

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
  const movieId = movie?.id;

  // Отримання трейлера
  const { data: videos } = useQuery({
    queryKey: ["movie-videos", movieId],
    queryFn: () => fetchMovieVideos(movieId!),
    enabled: !!movieId,
  });

  // Отримання стрімінгів
  const { data: watchProviders } = useQuery({
    queryKey: ["movie-providers", movieId],
    queryFn: () => fetchWatchProviders(movieId!, "UA"),
    enabled: !!movieId,
  });

  // Отримання акторів
  const { data: cast } = useQuery({
    queryKey: ["movie-cast", movieId],
    queryFn: () => fetchMovieCredits(movieId!),
    enabled: !!movieId,
  });

  if (!movie) return null;

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
                src={getImageUrl(movie.backdrop_path, "w780")}
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
                  src={getImageUrl(movie.poster_path, "w500")}
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
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {movie.title}
                </h3>
                <span className="text-xs text-muted-foreground capitalize">
                  {movie.original_title} ({movie.release_date.split("-")[0]})
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <span className="bg-accent/10 border border-accent/30 text-accent font-black text-xs px-2.5 py-0.5 rounded-full text-glow-accent">
                    ⭐ {movie.vote_average.toFixed(1)} / 10
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {movie.overview || "Опис фільму відсутній українською мовою."}
              </p>
            </div>
          </div>

          {/* Актори */}
          {cast && cast.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                У головних ролях
              </span>
              <div className="flex flex-wrap gap-2">
                {cast.map((c) => (
                  <div
                    key={c.id}
                    className="bg-background border border-border px-3 py-1 rounded-xl text-xs font-semibold text-foreground"
                  >
                    {c.name}{" "}
                    <span className="text-[10px] text-muted-foreground ml-1">
                      ({c.character})
                    </span>
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
                      src={getImageUrl(provider.logo_path, "w92")}
                      alt={provider.provider_name}
                      className="w-6 h-6 rounded-lg object-contain"
                    />
                    <span className="text-xs font-bold">
                      {provider.provider_name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Не знайдено активних сервісів стрімінгу для України. Перевірте
                оренду чи купівлю.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

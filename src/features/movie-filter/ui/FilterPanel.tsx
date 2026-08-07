// FilterPanel - мапінг емоцій користувача на реальні ID жанрів TMDB, обмеження за хронометражем та роком випуску

import React from "react";

export type MoodType = "joyful" | "tense" | "romantic" | "epic";
export type RuntimeType = "short" | "medium" | "any";
export type EraType = "classic" | "modern" | "recent" | "any";

export interface FilterState {
  mood: MoodType;
  runtime: RuntimeType;
  era: EraType;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
}) => {
  const setMood = (mood: MoodType) => onChange({ ...filters, mood });
  const setRuntime = (runtime: RuntimeType) =>
    onChange({ ...filters, runtime });
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
              {
                id: "joyful",
                label: "😂 Веселий",
                desc: "Комедії та анімація",
              },
              { id: "tense", label: "🍿 Напружений", desc: "Трилери та жахи" },
              {
                id: "romantic",
                label: "💖 Романтичний",
                desc: "Мелодрами та драми",
              },
              {
                id: "epic",
                label: "🚀 Епічний",
                desc: "Пригоди та фантастика",
              },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all duration-200 ${
                filters.mood === m.id
                  ? "bg-primary/10 border-primary text-primary text-glow-primary"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
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
              { id: "short", label: "⚡ Швидкий", desc: "< 90 хв" },
              { id: "medium", label: "🍿 Стандарт", desc: "90-130 хв" },
              { id: "any", label: "🎬 Будь-який", desc: "Без лімітів" },
            ] as const
          ).map((r) => (
            <button
              key={r.id}
              onClick={() => setRuntime(r.id)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                filters.runtime === r.id
                  ? "bg-secondary/10 border-secondary text-secondary text-glow-secondary"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
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
              { id: "classic", label: "📻 Класика", desc: "До 2000 року" },
              { id: "modern", label: "🎞 Сучасне", desc: "2000 - 2015 роки" },
              { id: "recent", label: "🔥 Новинки", desc: "Після 2016 року" },
              { id: "any", label: "🌍 Всі роки", desc: "Будь-який рік" },
            ] as const
          ).map((e) => (
            <button
              key={e.id}
              onClick={() => setEra(e.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                filters.era === e.id
                  ? "bg-accent/10 border-accent/60 text-accent text-glow-accent"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
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

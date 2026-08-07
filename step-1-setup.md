# Крок 1: Ініціалізація та дизайн-система

На цьому кроці ми створимо каркас проекту, використовуючи скрипт ініціалізації, та налаштуємо дизайн-систему на базі Tailwind CSS v4 та змінних Cyberpunk Neon теми.

---

## 1. Запуск скрипта ініціалізації
У кореневій папці вашого робочого простору запустіть скрипт для створення нового проекту:

```bash
bash init-react-project.sh movie-roulette-app
```

### Рекомендовані відповіді на запитання скрипта:
1. **Встановити Tailwind CSS v4?** `Y` (так, для сучасного та швидкого стилювання)
2. **Встановити та налаштувати shadcn/ui?** `Y` (так, для використання готових якісних примітивів, таких як Button, Dialog)
3. **Встановити React Router DOM?** `Y` (так, для забезпечення навігації між сторінками)
4. **Встановити TanStack React Query?** `Y` (так, для асинхронного кешування та запитів до TMDB API)
5. **Прокидувати queryClient в React Router?** `N` (ні, для простоти)
6. **Встановити Axios?** `Y` (так, для обробки HTTP-запитів)
7. **Встановити та налаштувати React Compiler?** `Y` (так, для автоматичної оптимізації рендерингу)
8. **Налаштувати аліаси шляхів (@/* -> src/*)?** `Y` (автоматично вмикається, необхідно для shadcn та FSD)

Скрипт самостійно створить проект, встановить необхідні залежності та згенерує початкову структуру папок Feature-Sliced Design (FSD).

---

## 2. Налаштування Tailwind CSS v4 та неонової теми

У Tailwind CSS v4 конфігурація перенесена безпосередньо у CSS-файл за допомогою директиви `@theme`.

Відкрийте файл `src/app/index.css` та замініть його вміст наступним кодом. Ми додамо CSS змінні для темно-фіолетової Cyberpunk теми з неоновими ефектами свічення:

```css
@import "tailwindcss";

@plugin "tailwindcss-animate";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: 260 25% 6%;
  --foreground: 260 10% 95%;
  --card: 260 20% 10%;
  --card-foreground: 260 10% 95%;
  --popover: 260 20% 8%;
  --popover-foreground: 260 10% 95%;
  --primary: 275 85% 60%;
  --primary-foreground: 260 10% 98%;
  --secondary: 320 90% 55%;
  --secondary-foreground: 260 10% 98%;
  --muted: 260 15% 15%;
  --muted-foreground: 260 10% 65%;
  --accent: 180 100% 50%;
  --accent-foreground: 260 10% 10%;
  --destructive: 0 85% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 260 20% 16%;
  --input: 260 20% 16%;
  --ring: 275 85% 60%;
  --radius: 1.25rem;

  /* RGB Values для тіней свічення */
  --primary-rgb: 168, 85, 247;
  --secondary-rgb: 236, 72, 153;
  --accent-rgb: 6, 182, 212;
}

@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

/* Глобальні налаштування стилів та неонове свічення */
@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: 'Outfit', 'Inter', system-ui, sans-serif;
  }
}

/* Утиліти для неонового тексту та тіней */
@utility text-glow-primary {
  text-shadow: 0 0 10px rgba(var(--primary-rgb), 0.6), 0 0 20px rgba(var(--primary-rgb), 0.3);
}

@utility text-glow-secondary {
  text-shadow: 0 0 10px rgba(var(--secondary-rgb), 0.6), 0 0 20px rgba(var(--secondary-rgb), 0.3);
}

@utility shadow-neon-primary {
  box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.4), 0 0 30px rgba(var(--primary-rgb), 0.2);
}

@utility shadow-neon-secondary {
  box-shadow: 0 0 15px rgba(var(--secondary-rgb), 0.4), 0 0 30px rgba(var(--secondary-rgb), 0.2);
}

@utility shadow-neon-accent {
  box-shadow: 0 0 15px rgba(var(--accent-rgb), 0.4), 0 0 30px rgba(var(--accent-rgb), 0.2);
}

/* Скроллбар у Cyberpunk стилі */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: hsl(var(--background));
}
::-webkit-scrollbar-thumb {
  background: hsl(var(--muted));
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary));
}
```

---

## 3. Перевірка структури папок

Переконайтеся, що структура проекту виглядає наступним чином:
```
movie-roulette-app/
├── src/
│   ├── app/
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── route.tsx
│   ├── pages/
│   ├── features/
│   ├── entities/
│   └── shared/
│       ├── api/
│       └── ui/
```

Ми підготували оточення та налаштували стилі. Наступний крок — створення API-клієнта для взаємодії з TMDB.

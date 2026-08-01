# Домашнє завдання №15: Рефакторинг проєкту Actor Explorer під архітектуру FSD Lite

У цьому домашньому завданні вам необхідно перевести ваш поточний проєкт **Дослідник акторів (Actor Explorer)** на сучасну фронтенд-архітектуру **Feature-Sliced Design (FSD Lite)**.

Ви проведете рефакторинг кодової бази, розділивши її на 5 функціональних шарів: `shared`, `entities`, `features`, `pages` та `app`. Це допоможе позбутися циклічних залежностей, ізолювати бізнес-дані від роутингу, приховати внутрішню реалізацію модулів та покращити загальну якість вашого коду.

---

## 🎯 Технічні вимоги

### 1. Налаштування Path Aliases (`@/*`)

- Налаштуйте аліаси шляхів у файлах `tsconfig.app.json` та `vite.config.ts`, щоб посилатися на папку `src/` через префікс `@/`.
- Повністю позбудьтеся глибоких відносних шляхів імпорту на кшталт `../../../../` у всьому проєкті.

### 2. Реалізація шару Shared (Спільне)

- Створіть папку `src/shared/` для коду, який не має жодної прив'язки до бізнес-доменів вашого додатку:
  - `shared/api/tmdbClient.ts` — чисте створення екземпляра `axios` із базовою URL-адресою, авторизацією та параметром мови.
  - `shared/ui/` — перевикористовувані чисті компоненти інтерфейсу (наприклад, кнопка пагінації `Pagination.tsx` або кастомні кнопки/інпути).
- Створіть Public API (`index.ts`) для кожного слайсу в `shared` для експорту елементів назовні.

### 3. Реалізація шару Entities (Сутності)

- Розділіть бізнес-дані на самостійні сутності:
  1. **`entities/actor` (або `entities/person`)**:
     - `model/types.ts` — TypeScript-типи актора та детальної інформації про нього.
     - `api/actor.ts` — функції запитів для отримання списку акторів, пошуку та детальної інформації, а також конфігурації React Query (наприклад, `actorDetailQuery` — **без лоадерів маршрутизації!**).
     - `ui/ActorCard.tsx` — компонент картки актора.
  2. **`entities/session` (Сесія користувача)**:
     - `api/session.ts` — функції для трьохетапного входу (отримання токена, валідація, створення сесії).
     - `model/session.ts` — чиста функція перевірки активності сесії `isSessionActive()`, яка перевіряє `localStorage` (без редиректів).
     - `ui/RequireAuth.tsx` — UI-компонент захисту маршрутів.
- Обов'язково створіть файл `index.ts` для кожної сутності.

> [!WARNING]
> **Сутності мають бути чистими!** Вони не повинні залежати від роутингу (`react-router`), не повинні виконувати редиректи (`redirect`) та не повинні містити лоадери. Усі лоадери переносяться на шар сторінок (`pages`).

### 4. Реалізація шару Features (Фічі)

- Створіть слайси для інтерактивних сценаріїв користувача:
  1. **`features/search-actors`** — форма пошуку акторів (`SearchForm.tsx`).
  2. **`features/auth-by-username`** — форма авторизації (`LoginForm.tsx`) та екшен маршрутизатора `loginAction.ts` для обробки сабміту форми.
  3. **`features/logout`** — кнопка виходу з системи. Винесіть її з шаблону в окремий UI-компонент `LogoutButton.tsx`. Створіть у `model/logout.ts` функцію для очищення токенів `clearSessionData()`.
- Налаштуйте Public API (`index.ts`) для кожної фічі.

### 5. Реалізація шару Pages та Layouts (Сторінки та Шаблони)

- Перенесіть шаблони `MainLayout` та `AuthLayout` у `src/pages/layouts` та створіть для них єдиний Public API (`index.ts`).
- Розділіть сторінки на ізольовані папки: `pages/home`, `pages/favorites`, `pages/actor-details`, `pages/login` та `pages/error`.
- Кожна сторінка повинна мати структуру:
  ```
  pages/[page-name]/
  ├── ui/
  │   └── [PageName].tsx  # React компонент сторінки
  ├── model/
  │   └── loader.ts       # Лоадер сторінки (якщо потрібен)
  └── index.ts            # Public API (експортує компонент та лоадер)
  ```
- Перенесіть логіку обробки параметрів URL та редиректів у відповідні лоадери сторінок (наприклад, `actorDetailLoader` у сторінку деталей, а перевірку доступу до приватних сторінок — у лоадери цих сторінок, використовуючи `isSessionActive` із `entities/session`).

### 6. Реалізація шару App (Додаток)

- Створіть папку `src/app/` для глобальної ініціалізації:
  - `app/styles/index.css` — глобальні стилі додатка (перенесені з кореня).
  - `app/route.tsx` — налаштування маршрутизації додатку. Усі імпорти сторінок, шаблонів та екшенів мають здійснюватися **виключно через їхні Public API**.
  - `app/main.tsx` — точка входу (ініціалізація React, підключення провайдерів QueryClientProvider та RouterProvider).
- Оновіть шлях до скрипта у файлі `index.html`: `<script type="module" src="/src/app/main.tsx"></script>`.

---

## 📂 Структура папок після рефакторингу

Перевірте, щоб папка `src` вашого проєкту відповідала наступній схемі:

```
src/
├── app/
│   ├── providers/
│   │   └── QueryProvider.tsx (опціонально)
│   ├── styles/
│   │   └── index.css
│   ├── main.tsx
│   └── route.tsx
│
├── pages/
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── index.ts
│   ├── home/
│   │   ├── ui/HomePage.tsx
│   │   └── index.ts
│   ├── favorites/
│   │   ├── ui/FavoritesPage.tsx
│   │   ├── model/loader.ts
│   │   └── index.ts
│   ├── actor-details/
│   │   ├── ui/ActorDetailsPage.tsx
│   │   ├── model/loader.ts
│   │   └── index.ts
│   ├── login/
│   │   ├── ui/LoginPage.tsx
│   │   └── index.ts
│   └── error/
│       ├── ui/ErrorPage.tsx
│       └── index.ts
│
├── features/
│   ├── search-actors/
│   │   ├── ui/SearchForm.tsx
│   │   └── index.ts
│   ├── auth-by-username/
│   │   ├── ui/LoginForm.tsx
│   │   ├── model/loginAction.ts
│   │   └── index.ts
│   └── logout/
│       ├── ui/LogoutButton.tsx
│       ├── model/logout.ts
│       └── index.ts
│
├── entities/
│   ├── actor/
│   │   ├── api/actor.ts
│   │   ├── model/types.ts
│   │   ├── ui/ActorCard.tsx
│   │   └── index.ts
│   └── session/
│       ├── api/session.ts
│       ├── model/session.ts
│       ├── ui/RequireAuth.tsx
│       └── index.ts
│
└── shared/
    ├── api/
    │   ├── tmdbClient.ts
    │   └── index.ts
    └── ui/
        ├── pagination/
        │   └── Pagination.tsx
        └── index.ts
```

---

## ⚠️ Правила ізоляції (Критерії оцінювання)

При перевірці вашого домашнього завдання особлива увага приділятиметься дотриманню правил архітектури FSD:

1. **Жодних висхідних імпортів:** Файли з `shared` не можуть імпортувати нічого з інших шарів. `entities` можуть імпортувати лише із `shared`. `features` — із `entities` та `shared`. `pages` — із `features`, `entities` та `shared`.
2. **Заборона горизонтальних імпортів:** Слайс `entities/actor` не може імпортувати нічого із `entities/session`. Якщо їм потрібно взаємодіяти, об'єднуйте їх на рівні `features` або `pages`.
3. **Імпорт тільки через Public API:** Будь-який імпорт з іншого слайсу має закінчуватися назвою цього слайсу. Глибокі імпорти (наприклад, `import ... from '@/entities/actor/ui/ActorCard'`) є грубим порушенням архітектури.
4. **Видалення застарілого коду:** Після успішного рефакторингу в колі `src/` не повинно залишитися старих папок `components/`, `services/`, `utils/`, `layouts/` тощо.

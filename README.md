# Домашнє завдання №13: Маршрутизація Дослідника акторів (Actor Explorer)

У цьому домашньому завданні вам необхідно модернізувати ваш попередній проєкт **Дослідник акторів (Actor Finder)**, перевівши його на нову бібліотеку маршрутизації **React Router v8** (у базовому Data Mode).

Ви позбудетесь локального стану для збереження сторінок та пошукових запитів, а також заміните модальне вікно на окрему повноцінну сторінку деталей актора. Вся навігація та фільтрація тепер керуватиметься через URL.

---

## 🎯 Технічні вимоги

1. **Встановлення та підключення роутера**:
   * Встановіть пакет `"react-router"`.
   * Створіть конфігурацію роутера за допомогою `createBrowserRouter` та підключіть його у `main.tsx` через `<RouterProvider>`.
2. **Створення шаблону `MainLayout`**:
   * Створіть шаблон `MainLayout` із шапкою (Header), навігацією (меню) та підвалом (Footer).
   * Елементи меню ("Головна", "Обране") мають бути компонентами `<NavLink>` з активними стилями (підсвічуванням поточної сторінки).
3. **Синхронізація пошуку та пагінації з URL (Search Params)**:
   * Перенесіть стан пошуку та пагінації з `useState` у параметри запиту URL (`?query=...&page=...`) за допомогою хука `useSearchParams`.
   * Забезпечте збереження стану при перезавантаженні сторінки (F5) та роботу кнопок Назад/Вперед у браузері.
4. **Динамічний маршрут деталей актора (URL Params)**:
   * Створіть окрему сторінку `ActorDetails.tsx` замість модального вікна `ActorDetailsModal.tsx`.
   * Шлях до сторінки деталей має виглядати як `/actor/:actorId`.
   * Зчитуйте `actorId` за допомогою хука `useParams` та робіть запити на деталі актора й фільмографію.
5. **Сторінка "Обране" (збереження в LocalStorage)**:
   * Створіть сторінку `Favorites.tsx`.
   * На сторінці деталей актора додайте кнопку "Додати в обране / Видалити з обраного", яка зберігає ID або об'єкт актора у `localStorage`.
   * На сторінці `Favorites` виводьте список збережених акторів з можливістю перейти на їхні деталі або видалити з обраного.

---

## 📂 Структура папок після рефакторингу

Після виконання завдання структура вашого каталогу `src` повинна виглядати так:

```
src/
├── components/
│   ├── ActorCard.tsx
│   ├── ActorList.tsx
│   ├── Pagination.tsx
│   └── SearchForm.tsx
├── layouts/
│   └── MainLayout.tsx
├── pages/
│   ├── Favorites.tsx
│   ├── Home.tsx
│   └── ActorDetails.tsx
├── services/
│   └── tmdbApi.ts
├── main.tsx
├── router.tsx
└── index.css
```

---

## 📝 Керівництво з реалізації

### Крок 1. Конфігурація роутера (`src/router.tsx`)

Визначте структуру маршрутів за допомогою `createBrowserRouter` та вкладіть сторінки в `MainLayout`:

```tsx
import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ActorDetails from "./pages/ActorDetails";
import Favorites from "./pages/Favorites";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "actor/:actorId",
        element: <ActorDetails />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
    ],
  },
]);
```

> [!IMPORTANT]
> Переконайтеся, що ви імпортуєте все саме з `"react-router"`, а не з застарілого `react-router-dom`.

---

### Крок 2. Шаблон `MainLayout` з активними лінками

Створіть `src/layouts/MainLayout.tsx`. Меню навігації має підсвічувати активний пункт за допомогою колбеку в `className` компонента `<NavLink>`:

```tsx
import { Outlet, NavLink, Link } from "react-router";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-purple-600 hover:text-purple-700 transition">
            🎬 Actor Explorer
          </Link>
          <nav className="flex gap-6 font-medium">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `transition duration-200 hover:text-purple-600 ${
                  isActive ? "text-purple-600 border-b-2 border-purple-600 pb-1" : "text-gray-600"
                }`
              }
            >
              Головна
            </NavLink>
            <NavLink 
              to="/favorites" 
              className={({ isActive }) => 
                `transition duration-200 hover:text-purple-600 ${
                  isActive ? "text-purple-600 border-b-2 border-purple-600 pb-1" : "text-gray-600"
                }`
              }
            >
              Обране
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Actor Explorer. Всі права захищено.</p>
      </footer>
    </div>
  );
}
```

---

### Крок 3. Перенесення стану пошуку та пагінації в URL (`src/pages/Home.tsx`)

Замініть локальні стейти на хук `useSearchParams`. При кожній зміні сторінки або надсиланні форми оновлюйте параметри URL через `setSearchParams`.

```tsx
// Спрощений алгоритм для src/pages/Home.tsx
import { useSearchParams } from "react-router";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  // React Query реагує на зміну query та page автоматично
  const { data } = useQuery({
    queryKey: ["actors", query, page],
    queryFn: () => query ? searchActors(query, page) : getPopularActors(page),
  });

  const handleSearch = (newQuery: string) => {
    setSearchParams({ query: newQuery, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
  };

  // ... рендер списку акторів та пагінації
}
```

---

### Крок 4. Створення сторінки деталей (`src/pages/ActorDetails.tsx`)

Сторінка деталей має повністю замінити модальне вікно. Додайте можливість повернутися назад за допомогою стандартного лінка або хука `useNavigate(-1)`.

```tsx
import { useParams, Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

export default function ActorDetails() {
  const { actorId } = useParams<{ actorId: string }>();
  const id = Number(actorId);
  const navigate = useNavigate();

  // Запит деталей актора та фільмографії...
  const { data: actor } = useQuery({
    queryKey: ["actor", id],
    queryFn: () => getActorDetails(id),
    enabled: !isNaN(id),
  });

  // Логіка додавання в обране в localStorage...

  return (
    <div>
      <button 
        onClick={() => navigate(-1)} 
        className="text-purple-600 hover:underline mb-6 font-semibold"
      >
        &larr; Назад
      </button>

      {/* Контент деталей актора, аналогічний модальному вікну з ДЗ 12 */}
    </div>
  );
}
```

---

### Крок 5. Сторінка "Обране" (`src/pages/Favorites.tsx`)

Реалізуйте відображення акторів, доданих у `localStorage`. Кожна картка актора в обраному має бути обгорнута в `<Link to={`/actor/${actor.id}`}>`, щоб користувач міг клікнути і переглянути його профіль. Також додайте кнопку видалення актора безпосередньо зі списку обраного.

---

## 🌟 Критерії оцінювання:
* **Базовий роутинг (30% бал)**: Додаток успішно завантажується за допомогою `RouterProvider`. Посилання в хедері змінюють URL без перезавантаження сторінки. Працює `NavLink` з активними класами.
* **Параметри URL (35% бал)**: Пошуковий запит та пагінація повністю прив'язані до URL. Копіювання посилання та відкриття в новій вкладці завантажує додаток на правильній сторінці з правильними результатами.
* **Сторінка деталей (20% бал)**: Клік на картку актора переводить на `/actor/:id`. Дані успішно завантажуються з API. Кнопка "Назад" повертає на попередній екран з історією пошуку.
* **Збереження обраного (15% бал)**: Користувач може додавати/видаляти акторів в обране, стан зберігається в `localStorage` та рендериться на сторінці `/favorites`.

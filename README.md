# Домашнє завдання №14: Безпека, автентифікація та обробка помилок в Actor Explorer

У цьому домашньому завданні вам необхідно покращити ваш проєкт **Дослідник акторів (Actor Explorer)**, інтегрувавши реальну авторизацію через TMDB API, захистивши приватні сторінки та додавши систему глобальної обробки помилок за допомогою React Router.

---

## 🎯 Технічні вимоги

1. **Реалізація автентифікації TMDB (React Router Actions)**:
   - Створіть сторінку входу `/login` з формою для введення логіна (`username`) та пароля (`password`).
   - Використовуйте компонент `<Form>` з React Router та напишіть асинхронний `loginAction` для обробки сабміту форми.
   - Усередині екшену реалізуйте 3-етапний процес авторизації TMDB:
     1. Отримання `request_token` (`GET /authentication/token/new`).
     2. Валідація токена за допомогою введенних логіна та пароля (`POST /authentication/token/validate_with_login`).
     3. Створення сесії `session_id` (`POST /authentication/session/new`).
   - Після успішної авторизації збережіть `tmdb_session_id` та `username` у `localStorage` та перенаправте користувача на головну сторінку (`/`).
   - У разі помилки від сервера відобразіть її користувачеві за допомогою хука `useActionData()`.

2. **Захист маршруту "Обране" (Route Guards / Loaders)**:
   - Створіть лоадер-захисник `requireAuthLoader`.
   - Підключіть його до маршруту `/favorites` (або іншого приватного маршруту).
   - Лоадер повинен перевіряти наявність `tmdb_session_id` у `localStorage`. Якщо токен відсутній, автоматично перенаправляйте користувача на сторінку `/login` за допомогою `redirect("/login")`.

3. **Вихід із системи (Logout Action)**:
   - Додайте у `MainLayout` кнопку "Вийти" (показується тільки авторизованим користувачам разом із їхнім іменем користувача).
   - Вихід з системи має відбуватися через форму `<Form action="/logout" method="post">` та відповідний екшен `logoutAction`.
   - Екшен повинен видаляти `tmdb_session_id` та `username` з `localStorage`, за бажанням робити запит на видалення сесії на сервері TMDB (`DELETE /authentication/session`), після чого перенаправляти на `/login`.

4. **Глобальний перехоплювач помилок (Error Boundary)**:
   - Створіть компонент `ErrorPage.tsx` за допомогою хука `useRouteError()`.
   - Підключіть його як `errorElement` для кореневого маршруту.
   - Напишіть гарний та інформативний інтерфейс для помилок. Окремо обробіть випадки:
     - Помилка 404 (сторінка не знайдена).
     - Помилка 401 (неавторизовано).
     - Помилка 500 або інші загальні збої JS.

---

## 📂 Структура папок після рефакторингу

```
src/
├── components/
│   ├── ActorCard.tsx
│   ├── ActorList.tsx
│   ├── Pagination.tsx
│   └── SearchForm.tsx
├── layouts/
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx       <-- Шаблон для авторизації (центрований контент)
├── pages/
│   ├── Favorites.tsx
│   ├── Home.tsx
│   ├── ActorDetails.tsx
│   ├── LoginForm.tsx        <-- Сторінка логіну
│   └── ErrorPage.tsx        <-- Сторінка помилки
├── api/
│   └── tmdbApi.ts           <-- Додані методи авторизації
├── utils/
│   └── auth.ts              <-- Лоадери для перевірки доступу
├── main.tsx
├── router.tsx
└── index.css
```

---

## 📝 Керівництво з реалізації

### Крок 1. Оновлення API-сервісу (`src/services/tmdbApi.ts`)

Додайте методи для роботи з авторизацією TMDB. Вони роблять запити на стандартні ендпоінти TMDB v3:

```typescript
// Отримання тимчасового токена запиту
export const getRequestToken = async () => {
  const response = await tmdbApi.get("/authentication/token/new");
  return response.data.request_token;
};

// Валідація токена за допомогою логіна й пароля
export const validateTokenWithLogin = async (
  username,
  password,
  requestToken,
) => {
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
export const createSessionId = async (requestToken) => {
  const response = await tmdbApi.post("/authentication/session/new", {
    request_token: requestToken,
  });
  return response.data.session_id;
};

// Функція-хелпер для швидкого входу
export const loginUser = async (username, password) => {
  const token = await getRequestToken();
  const validatedToken = await validateTokenWithLogin(
    username,
    password,
    token,
  );
  const sessionId = await createSessionId(validatedToken);
  return sessionId;
};
```

---

### Крок 2. Створення форми та екшену (`src/pages/LoginForm.tsx`)

Використовуйте стандартний React Router Action для авторизації:

```tsx
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  ActionFunctionArgs,
} from "react-router";
import { loginUser } from "../services/tmdbApi";

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { error: "Всі поля обов'язкові для заповнення" };
  }

  try {
    const sessionId = await loginUser(username, password);
    localStorage.setItem("tmdb_session_id", sessionId);
    localStorage.setItem("username", username);
    return redirect("/");
  } catch (error: any) {
    const apiError =
      error?.response?.data?.status_message || "Помилка автентифікації.";
    return { error: apiError };
  }
}

export default function LoginForm() {
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Вхід до TMDB
      </h2>
      {actionData?.error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4 border border-red-200 text-center">
          {actionData.error}
        </div>
      )}
      <Form method="post" className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Ім'я користувача
          </label>
          <input
            name="username"
            type="text"
            required
            disabled={isSubmitting}
            className="w-full border p-2.5 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Пароль
          </label>
          <input
            name="password"
            type="password"
            required
            disabled={isSubmitting}
            className="w-full border p-2.5 rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-lg transition disabled:bg-gray-400"
        >
          {isSubmitting ? "Вхід..." : "Увійти"}
        </button>
      </Form>
    </div>
  );
}
```

---

### Крок 3. Створення лоадеру для захисту маршрутів (`src/utils/auth.ts`)

```typescript
import { redirect } from "react-router";

export const requireAuthLoader = () => {
  const token = localStorage.getItem("tmdb_session_id");
  if (!token) {
    return redirect("/login");
  }
  return null;
};
```

---

### Крок 4. Створення глобальної сторінки помилки (`src/pages/ErrorPage.tsx`)

Створіть сторінку, що перехоплюватиме помилки завантаження даних та неправильних шляхів:

```tsx
import { useRouteError, isRouteErrorResponse, Link } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "Щось пішло не так. Спробуйте пізніше.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    if (error.status === 404) {
      errorMessage = "Ой! Такої сторінки не існує (404).";
    } else if (error.status === 401) {
      errorMessage = "У вас немає доступу до цієї сторінки.";
    } else {
      errorMessage = error.data?.message || error.statusText;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full border border-red-100">
        <div className="w-16 h-16 bg-red-100 text-red-650 rounded-full flex items-center justify-center text-2xl font-black mb-6 mx-auto">
          {errorStatus}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Сталася помилка
        </h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}
```

---

### Крок 5. Налаштування роутера (`src/router.tsx`)

Підключіть екшени, лоадери та помилки у ваш файл конфігурації:

```tsx
import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import ActorDetails from "./pages/ActorDetails";
import Favorites from "./pages/Favorites";
import LoginForm, { loginAction } from "./pages/LoginForm";
import ErrorPage from "./pages/ErrorPage";
import { requireAuthLoader } from "./utils/auth";
import { logoutAction } from "./utils/auth"; // або іншого файлу, де описано екшен виходу

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />, // Глобальний перехоплювач помилок
    children: [
      { index: true, element: <Home /> },
      { path: "actor/:actorId", element: <ActorDetails /> },
      {
        path: "favorites",
        element: <Favorites />,
        loader: requireAuthLoader, // Захист лоадером
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ path: "login", element: <LoginForm />, action: loginAction }],
  },
  {
    path: "logout",
    action: logoutAction, // Екшен виходу з системи
  },
]);
```

---

## 🌟 Критерії оцінювання

- **Обробка помилок (25% балів)**: Коректно підключено `errorElement` для роутера. Перевірено перехід за неіснуючим URL (має красиво показувати 404).
- **Повноцінний процес автентифікації (35% балів)**: Успішно реалізовано 3-етапний вхід через TMDB API за допомогою React Router Action. Токен зберігається у `localStorage`.
- **Захист сторінок (20% балів)**: При переході на `/favorites` неавторизованого користувача перенаправляє на `/login`. Після успішного входу користувач має отримати доступ до сторінки.
- **Логаут (20% балів)**: Реалізовано вихід з системи через `logoutAction`, після кліку на кнопку сесія видаляється з браузера та користувача повертає на сторінку входу.

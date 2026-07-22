# Домашнє завдання №12: Дослідник акторів (Actor Finder)

У цьому домашньому завданні вам потрібно створити додаток для пошуку акторів, перегляду їхніх біографій та фільмографій за допомогою **TMDB API**, **Axios** та **TanStack Query**.

Це завдання схоже за архітектурою на проєкт, який ми робили на уроці (пошук фільмів), але працює з іншою сутністю — **акторами (people)**, що дозволить вам самостійно пройти всі етапи інтеграції API та керування станом.

---

## 🎯 Технічні вимоги

1. **Встановлення бібліотек**: Додайте в проєкт `axios`, `@tanstack/react-query` та `react-hook-form`.
2. **Змінні оточення**: Використовуйте `VITE_TMDB_ACCESS_TOKEN` у файлі `.env.local` для авторизації.
3. **Список популярних акторів**: При першому завантаженні відображайте список популярних акторів за тиждень або загальний список популярних акторів.
4. **Пошук**: Реалізуйте пошук акторів за ім'ям за допомогою текстового поля. Пошук має працювати через сабміт форми (за допомогою `react-hook-form`).
5. **Пагінація**: Додайте можливість перемикання сторінок популярних акторів та результатів пошуку.
6. **Деталі у модальному вікні**: При кліку на картку актора має відкриватися модальне вікно з його детальною біографією, датою народження, місцем народження та списком відомих фільмів, у яких він брав участь.

---

## 📡 Необхідні ендпоінти TMDB API (v3)

1. **Популярні актори**:
   `GET /person/popular` (параметр `page` для пагінації)
2. **Пошук акторів**:
   `GET /search/person` (параметри `query` та `page`)
3. **Деталі актора**:
   `GET /person/{person_id}`
4. **Фільмографія актора (в яких фільмах знімався)**:
   `GET /person/{person_id}/movie_credits` (повертає масив фільмів у полі `cast`)

---

## 🎨 Статичні шаблони компонентів

Нижче наведено статичні шаблони компонентів із використанням **Tailwind CSS**. Скопіюйте їх у свій проєкт та зробіть динамічними (підключіть пропси, стейти, обробники подій та хуки `useQuery`).

### 1. Форма пошуку (`src/components/SearchForm.tsx`)

```tsx
export default function SearchForm() {
  return (
    <form className="flex max-w-lg mx-auto gap-2 mb-8">
      <input
        type="text"
        placeholder="Введіть ім'я актора..."
        className="flex-1 px-4 py-2 border rounded-md outline-none focus:border-blue-500 transition"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition"
      >
        Пошук
      </button>
    </form>
  );
}
```

*Завдання для студента:*
* Інтегрувати з `react-hook-form` (використати `useForm` та `register`).
* Реалізувати колбек-функцію `onSearch(query)` при відправці форми.
* Додати кнопку "Скинути", яка з'являється лише тоді, коли пошуковий запит не порожній.

---

### 2. Панель пагінації (`src/components/Pagination.tsx`)

```tsx
export default function Pagination() {
  return (
    <div className="flex justify-center items-center gap-4 mb-8">
      <button className="px-4 py-2 border rounded-md font-semibold text-gray-700 bg-white hover:bg-gray-50 transition">
        Назад
      </button>

      <span className="text-gray-700 font-medium">
        Сторінка <span className="font-bold text-purple-600">1</span> з 500
      </span>

      <button className="px-4 py-2 border rounded-md font-semibold text-gray-700 bg-white hover:bg-gray-50 transition">
        Вперед
      </button>
    </div>
  );
}
```

*Завдання для студента:*
* Додати пропси: `page`, `totalPages`, `onPageChange`.
* Вимикати (`disabled`) кнопку "Назад" на першій сторінці та "Вперед" на останній сторінці.

---

### 3. Картка актора (`src/components/ActorCard.tsx`)

```tsx
export default function ActorCard() {
  // Базовий URL для зображень TMDB
  const imageBaseUrl = "https://image.tmdb.org/t/p/w185";

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer flex flex-col items-center text-center">
      <img
        src="https://image.tmdb.org/t/p/w185/8G0w1n45T30D4e2Qc5y0rBq84GZ.jpg"
        alt="Кіану Рівз"
        className="rounded-md w-full h-[250px] object-cover mb-4"
      />
      <h2 className="text-lg font-bold">Кіану Рівз</h2>
      <p className="text-sm text-gray-500 mt-1">Популярність: 84.5</p>
    </div>
  );
}
```

*Завдання для студента:*
* Описати інтерфейс пропсів для отримання даних про актора (`id`, `name`, `profile_path`, `popularity`).
* Відображати зображення-заглушку, якщо `profile_path` дорівнює `null`.
* Реалізувати подію `onClick`, щоб при натисканні на картку відкривалося модальне вікно з цим актором.

---

### 4. Список акторів (`src/components/ActorList.tsx`)

```tsx
import ActorCard from "./ActorCard";

export default function ActorList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {/* Тут мають рендеритися ActorCard у циклі */}
      <ActorCard />
      <ActorCard />
      <ActorCard />
    </div>
  );
}
```

*Завдання для студента:*
* Отримати масив акторів через пропси.
* Додати перевірку на порожній масив (показувати повідомлення "Акторів не знайдено").

---

### 5. Модальне вікно деталей актора (`src/components/ActorDetailsModal.tsx`)

```tsx
export default function ActorDetailsModal() {
  const imageBaseUrl = "https://image.tmdb.org/t/p/";

  return (
    // Задній фон модалки (Backdrop)
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Контейнер модального вікна */}
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 md:p-8 shadow-2xl flex flex-col gap-6">
        
        {/* Кнопка закриття */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition">
          &times;
        </button>

        {/* Основна інформація */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <img
            src="https://image.tmdb.org/t/p/w185/8G0w1n45T30D4e2Qc5y0rBq84GZ.jpg"
            alt="Кіану Рівз"
            className="rounded-lg w-full h-auto shadow-md"
          />

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900">Кіану Рівз</h2>
            
            <div className="flex flex-col gap-1 text-sm text-gray-700">
              <span>🎂 Дата народження: 1964-09-02 (Вік: 61 рік)</span>
              <span>📍 Місце народження: Бейрут, Ліван</span>
            </div>

            <div>
              <h3 className="text-md font-bold text-gray-800">Біографія</h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Кіану Чарльз Рівз — канадський актор, кінопродюсер, кліпмейкер та музикант. Найбільш відомий своїми ролями у кінофраншизах «Матриця» та «Джон Вік»...
              </p>
            </div>
          </div>
        </div>

        {/* Фільмографія (перші 6 фільмів) */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Відомі роботи (Фільмографія)</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((id) => (
              <div key={id} className="text-center">
                <div className="w-full h-[120px] bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                  Постер фільму
                </div>
                <p className="font-bold text-xs mt-1.5 line-clamp-1">Фільм {id}</p>
                <p className="text-[10px] text-gray-500 line-clamp-1">Персонаж {id}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
```

*Завдання для студента:*
* Написати запити `useQuery` для отримання детальної інформації про актора (`/person/{id}`) та його фільмографії (`/person/{id}/movie_credits`).
* Робити запити лише у разі, якщо вибрано `personId` (використати `enabled`).
* Відображати стан завантаження деталей та помилку.
* Реалізувати закриття модального вікна при кліку на хрестик або на темний фон навколо форми (використати `e.stopPropagation()`).
* Рендерити перші 6 відомих фільмів актора з його фільмографії.

---

## 🔥 Поради щодо реалізації

1. **Кешування**: Встановіть оптимальний час `staleTime` для деталей актора, наприклад, 10 хвилин (оскільки біографія актора не змінюється кожні кілька секунд).
2. **Красивий UX**: Показуйте крутилку (Spinner) або анімацію завантаження, поки робляться запити.
3. **Обробка відсутніх даних**: Часто у менш популярних акторів може бути порожнє поле `biography` або відсутнє фото. Завжди робіть перевірку `if (!biography)` та підставляйте резервні тексти на кшталт `"Біографія відсутня"`.

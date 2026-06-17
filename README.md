# Практичне завдання №2: Компоненти, Пропси, Списки та Стилізація у React + TypeScript

## Мета завдання

Закріпити знання про основи JSX, роботу з пропсами (Props), типізацію компонентів та пропсів за допомогою TypeScript, рендеринг списків через метод `.map()`, умовний рендеринг елементів, патерн "Композиція" та стилізацію інтерфейсу за допомогою глобального CSS.

---

## Загальні вимоги до виконання

1. Проект повинен бути створений на базі **Vite** з шаблоном **React + TypeScript** (можна використовувати наявний або створити новий).
2. Усі компоненти мають бути строго типізовані за допомогою TypeScript (використовуйте `interface` для пропсів). Не використовуйте тип `any`.
3. Усі компоненти повинні бути розташовані в окремих файлах у папці `src/components/`.
4. Стилі повинні бути описані **глобально** у файлі `src/index.css` (або іншому глобальному файлі стилів, підключеному в проект). **Використання CSS-модулів або Tailwind CSS у цьому завданні заборонено.**
5. Для рендерингу списків обов'язково використовуйте унікальні значення як проп `key` (не використовуйте індекс масиву).
6. Дані для компонентів (mock data) створіть в окремих JSON-файлах у папці `src/data/` (наприклад, `user.json`, `data.json`, `friends.json`) та імпортуйте їх у `App.tsx`.

---

## 🛠️ Завдання

### 1. Профіль соціальної мережі (`Profile`)

Створіть компонент `<Profile>`, який відображає інформацію про користувача соціальної мережі.

#### Структура даних користувача (`src/data/user.json`):
```json
{
  "username": "Jacques Gluke",
  "tag": "jgluke",
  "location": "Ocho Rios, Jamaica",
  "avatar": "https://cdn-icons-png.flaticon.com/512/2922/2922506.png",
  "stats": {
    "followers": 5603,
    "views": 4827,
    "likes": 1308
  }
}
```

#### Пропси компонента `ProfileProps`:
- `username`: рядок (ім'я користувача)
- `tag`: рядок (нікмек без @)
- `location`: рядок (країна, місто)
- `avatar`: рядок (посилання на зображення аватара)
- `stats`: об'єкт із кількістю `followers`, `views` та `likes` (усі поля — числа)

#### Рекомендована розмітка JSX:
```tsx
<div className="profile">
  <div className="description">
    <img src={avatar} alt="User avatar" className="avatar" />
    <p className="name">{username}</p>
    <p className="tag">@{tag}</p>
    <p className="location">{location}</p>
  </div>

  <ul className="stats">
    <li>
      <span className="label">Followers</span>
      <span className="quantity">{stats.followers}</span>
    </li>
    <li>
      <span className="label">Views</span>
      <span className="quantity">{stats.views}</span>
    </li>
    <li>
      <span className="label">Likes</span>
      <span className="quantity">{stats.likes}</span>
    </li>
  </ul>
</div>
```

---

### 2. Секція статистики (`Statistics`)

Створіть компонент `<Statistics>`, який відображає статистику з різними категоріями та значеннями у відсотках.

#### Структура даних (`src/data/data.json`):
```json
[
  { "id": "id-1", "label": ".docx", "percentage": 22 },
  { "id": "id-2", "label": ".pdf", "percentage": 4 },
  { "id": "id-3", "label": ".mp3", "percentage": 17 },
  { "id": "id-4", "label": ".psd", "percentage": 47 },
  { "id": "id-5", "label": ".pdf", "percentage": 10 }
]
```

#### Пропси компонента `StatisticsProps`:
- `title`: рядок (опціональний заголовок секції)
- `stats`: масив об'єктів, де кожен об'єкт містить `id` (рядок), `label` (рядок) та `percentage` (число)

#### Вимоги до реалізації:
1. **Умовний рендеринг**: Заголовок `<h2>` повинен рендеритися лише тоді, коли передано проп `title`. Якщо проп не передано — заголовка в DOM не повинно бути.
2. **Рендеринг списку**: Відрендерити елементи масиву `stats` за допомогою `.map()`. Як унікальний `key` використати `id` об'єкта.

#### Рекомендована розмітка JSX:
```tsx
<section className="statistics">
  {title && <h2 className="title">{title}</h2>}

  <ul className="stat-list">
    {stats.map(({ id, label, percentage }) => (
      <li key={id} className="item">
        <span className="label">{label}</span>
        <span className="percentage">{percentage}%</span>
      </li>
    ))}
  </ul>
</section>
```

---

### 3. Список друзів (`FriendList` та `FriendListItem`)

Створіть компоненти `<FriendList>` та дочірній `<FriendListItem>` для відображення списку друзів користувача.

#### Структура даних (`src/data/friends.json`):
```json
[
  { "avatar": "https://cdn-icons-png.flaticon.com/512/1998/1998592.png", "name": "Mango", "isOnline": true, "id": 1812 },
  { "avatar": "https://cdn-icons-png.flaticon.com/512/616/616408.png", "name": "Kiwi", "isOnline": false, "id": 1137 },
  { "avatar": "https://cdn-icons-png.flaticon.com/512/1998/1998749.png", "name": "Ajax", "isOnline": true, "id": 737 },
  { "avatar": "https://cdn-icons-png.flaticon.com/512/1623/1623681.png", "name": "Jay", "isOnline": true, "id": 258 }
]
```

#### Вимоги до реалізації:
1. **Композиція**: Компонент `<FriendList>` є списком `<ul>` та рендерить всередині себе елементи `<FriendListItem>` для кожного друга з масиву `friends`.
2. **Умовне стилізування**: Статус `isOnline` повинен визначати колір індикатора статусу: зелений (`online`) або червоний (`offline`). Додайте відповідні класи динамічно залежно від значення boolean.

#### Пропси для `FriendListProps`:
- `friends`: масив об'єктів друга.

#### Пропси для `FriendListItemProps`:
- `avatar`: рядок (посилання на фото)
- `name`: рядок (ім'я)
- `isOnline`: логічне значення (true/false)

#### Рекомендована розмітка JSX:

**Компонент `FriendList`:**
```tsx
<ul className="friend-list">
  {/* Тут мапляться FriendListItem */}
</ul>
```

**Компонент `FriendListItem`:**
```tsx
<li className="friend-item">
  <span className={`status ${isOnline ? 'online' : 'offline'}`}></span>
  <img className="avatar" src={avatar} alt="User avatar" width="48" />
  <p className="name">{name}</p>
</li>
```


## Головний компонент `App.tsx`

Імпортуйте дані з JSON-файлів та відобразіть усі створені компоненти всередині головного компонента `App`. Загорніть їх в один загальний контейнер для красивого позиціонування на екрані.

```tsx
import user from "./data/user.json";
import data from "./data/data.json";
import friends from "./data/friends.json";

import Profile from "./components/Profile";
import Statistics from "./components/Statistics";
import FriendList from "./components/FriendList";

function App() {
  return (
    <div className="app-container">
      <Profile
        username={user.username}
        tag={user.tag}
        location={user.location}
        avatar={user.avatar}
        stats={user.stats}
      />
      <Statistics title="Upload stats" stats={data} />
      <FriendList friends={friends} />
    </div>
  );
}

export default App;
```

---

## 🎨 Стилізація (Глобальний CSS)

Реалізуйте стилі у файлі `src/index.css`. Нижче наведено орієнтовні візуальні вимоги:
- Кожен компонент має виглядати як окрема картка з рамкою, закругленими кутами та легкою тінню (box-shadow).
- Картка `<Profile>` повинна бути відцентрована, мати фіксовану ширину, круглу аватарку та сітку в секції статистики.
- Список друзів повинен відображати статус у вигляді круглого кольорового індикатора (зелений для `true`, червоний для `false`).
- `app-container` має вирівнювати елементи по центру сторінки з гарними відступами між компонентами (наприклад, за допомогою Flexbox або Grid).

---

## Критерії оцінювання

- **Компонентна структура**: Усі компоненти рознесені по окремих `.tsx` файлах, код структурований.
- **Типізація**: Пропси кожного компонента повністю описані відповідними TypeScript інтерфейсами. Тип `any` не використовується.
- **Коректність JSX та списків**: Правильно перейменовані атрибути (`className`), у всіх списках `.map()` передано унікальний проп `key` (id об'єктів).
- **Умовний рендеринг**: Логіка з умовним рендерингом заголовка статистики та статусу друзів працює правильно.
- **Глобальна стилізація**: Застосовано стилі з файлу `src/index.css` без використання CSS-модулів чи сторонніх бібліотек стилізації. Інтерфейс виглядає сучасно та охайно.

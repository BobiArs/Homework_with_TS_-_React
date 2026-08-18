# 🏠 Домашнє завдання: Практика з патернами Render Props та Slots

Ласкаво просимо до домашнього завдання! У цій роботі ви навчитеся застосовувати просунуті патерни проектування — **Render Props** та **Slots** — на базі вже готового проекту гри **Хрестики-Нулики (Tic-Tac-Toe)**.

Ваш проект для роботи знаходиться у папці:
`[tic-tak-toe]`

---

## 🎯 Мета завдання

Переписати плоску структуру головного компонента `App.tsx` та винести розмітку в перевикористовувані компоненти з гнучким API за допомогою патернів **Render Props** та **Slots**.

---

## 🛠️ Завдання

### Частина 1: Патерн Render Props (Універсальна сітка ігрового поля)

Зараз у файлі `App.tsx` рендеринг ігрового поля виглядає так:

```tsx
<div className="board">
  {cells.map((cell, index) => (
    <Cell
      value={cell}
      key={index}
      onCellClick={() => handleCellClick(index)}
      isWinner={winnerCombination.includes(index)}
    />
  ))}
</div>
```

**Ваша задача:**

1. Створіть новий компонент `BoardRenderer` у папці `src/components/BoardRenderer.tsx`.
2. Цей компонент має приймати:
   - `items`: масив значень клітинок (`string[]` або `Array<string | null>`).
   - `renderItem`: функцію зворотного виклику (render prop) з типом `(value: string | null, index: number) => React.ReactNode`.
3. Всередині `BoardRenderer` обгорніть елементи у контейнер з класом `board` та викликайте `renderItem` для перебору клітинок.
4. Використайте `BoardRenderer` у файлі `App.tsx`, прокинувши туди масив `cells` та рендер-функцію, яка повертає компонент `<Cell />` з усіма необхідними пропсами.

---

### Частина 2: Патерн Slots (Гнучка структура гри - GameLayout)

Зараз інтерфейс гри в `App.tsx` рендериться суцільним «рулоном» один за одним: кнопка теми, заголовок, статус, таймер, дошка та кнопка скидання.

**Ваша задача:**

1. Створіть компонент `GameLayout` у папці `src/components/GameLayout.tsx`.
2. Цей компонент має відповідати за загальну розмітку сторінки гри та містити іменовані слоти:
   - `headerSlot` (для кнопки зміни теми та заголовка гри).
   - `statusSlot` (для відображення поточної черги гравця, статусу переможця чи нічиєї).
   - `timerSlot` (для відображення таймера гри).
   - `boardSlot` (для ігрового поля `BoardRenderer`).
   - `controlsSlot` (для кнопок керування, таких як кнопка скидання гри).
3. Додайте стилізацію або класи Tailwind, щоб гарно структурувати ці зони на екрані.
4. Оновіть `App.tsx`: огорніть всю гру в `<GameLayout />` та передайте відповідні JSX-елементи у визначені слоти.

---

## 📋 Вимоги до виконання

1. **Збереження працездатності:** Логіка гри (хід гравців, визначення переможця, таймер, зміна теми) має працювати без жодних змін.
2. **Типізація (TypeScript):** Усі пропси нових компонентів (інтерфейси для слотів та рендер-пропів) мають бути чітко типізовані.
3. **Стилі:** Використовуйте оригінальні CSS-класи проекту (`game`, `board`, `timer`, `reset`, `theme-toggle-btn`) для стилізації.

---

## 💡 Приклад того, як має змінитися App.tsx

Після виконання рефакторингу структура рендерингу у вашому `App.tsx` має виглядати приблизно так:

```tsx
return (
  <GameLayout
    headerSlot={
      <div className="flex justify-between items-center w-full">
        <TitleGame title="Гра хрестики нулики" />
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "light" ? "Темна тема 🌙" : "Світла тема ☀️"}
        </button>
      </div>
    }
    statusSlot={
      <Status player={currentPlayer} winner={winner} isDraw={isDraw} />
    }
    timerSlot={<div className="timer"> Час гри: {formatTime(seconds)}</div>}
    boardSlot={
      <BoardRenderer
        items={cells}
        renderItem={(cell, index) => (
          <Cell
            value={cell}
            key={index}
            onCellClick={() => handleCellClick(index)}
            isWinner={winnerCombination.includes(index)}
          />
        )}
      />
    }
    controlsSlot={
      <button className="reset" onClick={handleReset}>
        Скинути гру
      </button>
    }
  />
);
```

Бажаємо успіху у виконанні завдання! 🚀

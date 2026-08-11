import { useState, useCallback } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const increment = useCallback(() => {
    const newVal = count + 1;
    setCount(newVal);
    setHistory([...history, newVal].slice(-5));
  }, [count, history]);

  const decrement = useCallback(() => {
    const newVal = count - 1;
    setCount(newVal);
    setHistory([...history, newVal].slice(-5));
  }, [count, history]);

  const reset = useCallback(() => {
    setCount(0);
    setHistory([]); // Очищуємо історію при скиданні, згідно з README.md
  }, []); // Залежності не потрібні, оскільки історія завжди встановлюється на порожній масив

  return (
    <div className="counter-container">
      <div className="counter card">
        <h2>Базовий лічильник</h2>
        <p className="count-value" data-testid="count-value">
          {count}
        </p>
        <div className="buttons">
          <button onClick={decrement}>-</button>
          <button onClick={increment}>+</button>
          <button onClick={reset} className="reset">
            Скинути
          </button>
        </div>

        <div className="history card">
          <h3>Історія останніх 5 значень</h3>
          <ul>
            {history.map((value, indx) => (
              <li key={indx}>{value}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

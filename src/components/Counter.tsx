import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export function Counter() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const increment = () => {
    const newVal = count + 1;
    setCount(newVal);
    setHistory([...history, newVal].slice(-5));
  };

  const decrement = () => {
    const newVal = count - 1;
    setCount(newVal);
    setHistory([...history, newVal].slice(-5));
  };

  const reset = () => {
    setCount(0);
    setHistory([...history, 0].slice(-5));
  };

  return (
    <div className="counter-container">
      <div className={`counter card ${isDark ? "dark-card" : ""}`}>
        <h2>Базовий лічильник</h2>
        <p className="count-value">{count}</p>
        <div className="buttons">
          <button onClick={decrement} className={isDark ? "dark-btn" : ""}>-</button>
          <button onClick={increment} className={isDark ? "dark-btn" : ""}>+</button>
          <button onClick={reset} className={`reset ${isDark ? "dark-btn" : ""}`}>
            Скинути
          </button>
        </div>

        <div className={`history ${isDark ? "dark-history" : ""}`}>
          <h3>Історія останніх 5 значень</h3>
          <ul>
            {history.map((value, indx) => (
              <li key={indx} className={isDark ? "dark-li" : ""}>{value}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


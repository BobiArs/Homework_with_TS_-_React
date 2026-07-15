import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export function ColorCounter() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState("black");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => {
    setCount(0);
    setColor("black");
  };

  const colors = ["red", "green", "blue", "yellow", "purple", "orange"];

  const textDisplayColor = color === "black" ? (isDark ? "#f5f6fa" : "black") : color;

  return (
    <div className="counter-containerC">
      <div className={`color-counter card ${isDark ? "dark-card" : ""}`}>
        <h2>Лічильник зі зміною кольора</h2>
        <p className="count-value" style={{ color: textDisplayColor, textAlign: "center" }}>
          {count}
        </p>
        <div className="buttons">
          <button onClick={decrement} className={isDark ? "dark-btn" : ""}>-</button>
          <button onClick={increment} className={isDark ? "dark-btn" : ""}>+</button>
          <button onClick={reset} className={`reset ${isDark ? "dark-btn" : ""}`}>
            Скинути
          </button>
        </div>

        <div className="color-picker">
          {colors.map((c) => (
            <div
              key={c}
              className="color-square"
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}


import { useState } from "react";

export function ColorCounter() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState("black");
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  const colors = ["red", "green", "blue", "yellow", "purple", "orange"];

  return (
    <div className="counter-containerC">
      <div className="color-counter card">
        <h2>Лічильник зі зміною кольора</h2>
        <p className="count-value" style={{ color, textAlign: "center" }}>
          {count}
        </p>
        <div className="buttons">
          <button onClick={decrement}>-</button>
          <button onClick={increment}>+</button>
          <button onClick={reset} className="reset">
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

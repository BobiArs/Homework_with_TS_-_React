import { Counter } from "./components/Counter";
import "./App.css";
import { ColorCounter } from "./components/ColorCounter";
import { useTheme } from "./context/ThemeContext";
import { ThemeToggler } from "./components/ThemeToggler";

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app-container ${theme === "dark" ? "dark-theme" : ""}`}>
      <div className="header">
        <ThemeToggler />
      </div>
      <div className="counters-row">
        <Counter />
        <ColorCounter />
      </div>
    </div>
  );
}

export default App;


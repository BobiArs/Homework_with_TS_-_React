import { useTheme } from "../context/ThemeContext";

export function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggler-btn ${theme === "dark" ? "dark-btn" : ""}`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

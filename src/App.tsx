import { useEffect } from "react";
import { Cell } from "./components/Cell";
import { Status } from "./components/Status";
import { TitleGame } from "./components/TitleGame";
import { useTheme } from "./context/ThemeContext";
import useGame from "./hooks/useGame";
import { BoardRenderer } from "./components/BoardRenderer";
import { GameLayout } from "./components/GameLayout";

const formatTime = (timeInSeconds: number): string => {
  const mins = Math.floor(timeInSeconds / 60);
  const secs = timeInSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

function App() {
  const {
    cells,
    currentPlayer,
    winner,
    winnerCombination,
    isDraw,
    handleCellClick,
    handleReset,
    seconds,
  } = useGame();

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

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
}

export default App;

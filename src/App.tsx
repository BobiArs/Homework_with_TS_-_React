import { useEffect, memo } from "react";
import { Cell } from "./components/Cell";
import { Status } from "./components/Status";
import { TitleGame } from "./components/TitleGame";
import { useTheme } from "./context/ThemeContext";
import { GameProvider, useGameContext } from "./context/GameContext";
import { BoardRenderer } from "./components/BoardRenderer";
import { GameLayout } from "./components/GameLayout";
import { Timer } from "./components/Timer";

function GameContent() {
  const {
    cells,
    currentPlayer,
    winner,
    winnerCombination,
    isDraw,
    handleCellClick,
    handleReset,
  } = useGameContext();

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
      timerSlot={<Timer />}
      boardSlot={
        <BoardRenderer
          items={cells}
          renderItem={(cell, index) => (
            <Cell
              value={cell}
              key={index}
              index={index}
              onCellClick={handleCellClick}
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

const MemoizedGameContent = memo(GameContent);

function App() {
  return (
    <GameProvider>
      <MemoizedGameContent />
    </GameProvider>
  );
}

export default App;

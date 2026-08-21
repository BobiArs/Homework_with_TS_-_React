import { createContext, useContext, useMemo, type ReactNode } from "react";
import useGame from "../hooks/useGame";
import type { BoardState, Player, CellValue } from "../types";

interface IGameContext {
  cells: BoardState;
  currentPlayer: Player;
  winner: CellValue;
  winnerCombination: number[];
  isDraw: boolean;
  handleCellClick: (index: number) => void;
  handleReset: () => void;
}

const GameContext = createContext<IGameContext | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const {
    cells,
    currentPlayer,
    winner,
    winnerCombination,
    isDraw,
    handleCellClick,
    handleReset,
  } = useGame();

  const value = useMemo(
    () => ({
      cells,
      currentPlayer,
      winner,
      winnerCombination,
      isDraw,
      handleCellClick,
      handleReset,
    }),
    [
      cells,
      currentPlayer,
      winner,
      winnerCombination,
      isDraw,
      handleCellClick,
      handleReset,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}

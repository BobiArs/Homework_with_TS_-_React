import { useState, useEffect } from "react";
import type { BoardState, Player, WinResult } from "../types";

const WINNING_COMBINATIONS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Рядки (горизонтальні лінії)
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Стовпці (вертикальні лінії)
  [0, 4, 8],
  [2, 4, 6], // Діагоналі
];

function checkWinner(currentBoard: BoardState): WinResult | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (
      currentBoard[a] &&
      currentBoard[a] === currentBoard[b] &&
      currentBoard[a] === currentBoard[c]
    ) {
      return {
        winner: currentBoard[a] as Player,
        combination,
      };
    }
  }
  return null;
}

export default function useGame() {
  const [cells, setCells] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [seconds, setSeconds] = useState(0);
  const winnerResult = checkWinner(cells);
  const winner = winnerResult ? winnerResult.winner : null;
  const winnerCombination = winnerResult ? winnerResult.combination : [];
  const isDraw = !winner && cells.every((cell) => cell != null);

  useEffect(() => {
    if (winner || isDraw) return;
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [winner, isDraw]);

  const handleCellClick = (index: number): void => {
    if (cells[index] || winner || isDraw) {
      return;
    }

    const newCells = [...cells];
    newCells[index] = currentPlayer;
    setCells(newCells);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleReset = () => {
    setCells(Array(9).fill(null));
    setSeconds(0);
    if (winner) {
      setCurrentPlayer(winner === "X" ? "O" : "X");
    }
  };

  return {
    cells,
    currentPlayer,
    winner,
    winnerCombination,
    isDraw,
    handleCellClick,
    handleReset,
    seconds,
  };
}

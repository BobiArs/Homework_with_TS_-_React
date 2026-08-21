import { useState, useEffect, memo } from "react";
import { useGameContext } from "../context/GameContext";

const formatTime = (timeInSeconds: number): string => {
  const mins = Math.floor(timeInSeconds / 60);
  const secs = timeInSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function TimerComponent() {
  const { winner, isDraw, cells } = useGameContext();
  const [seconds, setSeconds] = useState(0);

  // Reset timer if board is cleared (all cells are null)
  const isInitialBoard = cells.every((cell) => cell === null);
  useEffect(() => {
    if (isInitialBoard) {
      setSeconds(0);
    }
  }, [isInitialBoard]);

  useEffect(() => {
    if (winner || isDraw) return;

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [winner, isDraw]);

  return <div className="timer"> Час гри: {formatTime(seconds)}</div>;
}

export const Timer = memo(TimerComponent);

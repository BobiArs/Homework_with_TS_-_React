import type { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext";

interface GameLayoutProps {
  headerSlot: ReactNode;
  statusSlot: ReactNode;
  timerSlot: ReactNode;
  boardSlot: ReactNode;
  controlsSlot: ReactNode;
}

export function GameLayout({
  headerSlot,
  statusSlot,
  timerSlot,
  boardSlot,
  controlsSlot,
}: GameLayoutProps) {
  const { theme } = useTheme();
  return (
    <div className={`game ${theme === "dark" ? "dark" : ""}`}>
      {headerSlot}
      {statusSlot}
      {timerSlot}
      {boardSlot}
      {controlsSlot}
    </div>
  );
}

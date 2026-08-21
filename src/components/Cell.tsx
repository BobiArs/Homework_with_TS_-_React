import { memo } from "react";
import { useTheme } from "../context/ThemeContext";
import type { CellValue } from "../types";
import clsx from "clsx";

interface CellProps {
  value: CellValue;
  index?: number;
  onCellClick: (index: number) => void;
  isWinner: boolean;
}

export function CellComponent({ value, index, onCellClick, isWinner }: CellProps) {
  const { theme } = useTheme();

  // const cellClass = `cell ${
  //   value === "X" ? "x-mark" : value === "O" ? "o-mark" : ""
  // }
  //   ${isWinner ? "winner" : ""}
  //   ${theme === "dark" ? "dark-cell" : ""}`;

  const cellClass2 = clsx("cell", {
    "x-mark": value === "X",
    "o-mark": value === "O",
    winner: isWinner,
    "dark-cell": theme === "dark",
  });

  return (
    <div className={cellClass2} onClick={() => onCellClick(index ?? 0)}>
      {value}
    </div>
  );
}

export const Cell = memo(CellComponent);

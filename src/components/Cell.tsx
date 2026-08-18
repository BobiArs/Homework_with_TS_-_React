import { useTheme } from "../context/ThemeContext";
import type { CellValue } from "../types";
import clsx from "clsx";

interface CellProps {
  value: CellValue;
  onCellClick: () => void;
  isWinner: boolean;
}

export function Cell({ value, onCellClick, isWinner }: CellProps) {
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
    <div className={cellClass2} onClick={onCellClick}>
      {value}
    </div>
  );
}

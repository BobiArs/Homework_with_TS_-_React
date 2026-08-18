import type { CellValue, Player } from "../types";

interface StatusProps {
  player: Player;
  winner: CellValue;
  isDraw: boolean;
}

export function Status({ player, winner, isDraw }: StatusProps) {
  if (winner) {
    return (
      <div className="turn">
        Гравець{" "}
        <span className={winner === "X" ? "x-mark" : "o-mark"}>{winner}</span>{" "}
        переміг!
      </div>
    );
  }

  if (isDraw) {
    return <div className="turn">Нічия!</div>;
  }

  return (
    <div className="turn">
      Хід гравця{" "}
      <span className={player === "X" ? "x-mark" : "o-mark"}>{player}</span>
    </div>
  );
}

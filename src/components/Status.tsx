import styled from "styled-components";
import type { CellValue, Player } from "../types";

interface StatusProps {
  player: Player;
  winner: CellValue;
  isDraw: boolean;
}

const StatusContainer = styled.div`
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: #34495e;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  display: inline-block;
  font-weight: 500;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

interface MarkProps {
  $player: CellValue;
}

const Mark = styled.span<MarkProps>`
  font-weight: 700;
  color: ${props => (props.$player === "X" ? "#e74c3c" : "#007bff")};
`;

export function Status({ player, winner, isDraw }: StatusProps) {
  if (winner) {
    return (
      <StatusContainer>
        Гравець <Mark $player={winner}>{winner}</Mark> переміг!
      </StatusContainer>
    );
  }

  if (isDraw) {
    return <StatusContainer>Нічия!</StatusContainer>;
  }

  return (
    <StatusContainer>
      Хід гравця <Mark $player={player}>{player}</Mark>
    </StatusContainer>
  );
}


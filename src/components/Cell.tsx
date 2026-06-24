import styled, { keyframes, css } from "styled-components";
import type { CellValue } from "../types";

interface CellProps {
  value: CellValue;
  onCellClick: () => void;
  isWinner: boolean;
}

const winPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(46, 204, 113, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
  }
`;

interface StyledCellProps {
  $isWinner: boolean;
  $value: CellValue;
}

const StyledCell = styled.div<StyledCellProps>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: bold;
  user-select: none;

  color: ${props => {
    if (props.$value === "X") return "#e74c3c";
    if (props.$value === "O") return "#3498db";
    return "inherit";
  }};

  text-shadow: ${props => {
    if (props.$value === "X") return "2px 2px 4px rgba(231, 76, 60, 0.2)";
    if (props.$value === "O") return "2px 2px 4px rgba(52, 152, 219, 0.2)";
    return "none";
  }};

  &:hover {
    background-color: #f8f9fa;
    transform: scale(1.05);
  }

  ${props =>
    props.$isWinner &&
    css`
      background: linear-gradient(45deg, #2ecc71, #27ae60);
      color: white !important;
      border: 2px solid #27ae60;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2) !important;
      transform: scale(1.05);
      animation: ${winPulse} 1.5s ease-in-out infinite;

      &:hover {
        transform: scale(1.05);
        background: linear-gradient(45deg, #27ae60, #2ecc71);
      }
    `}
`;

export function Cell({ value, onCellClick, isWinner }: CellProps) {
  return (
    <StyledCell $value={value} $isWinner={isWinner} onClick={onCellClick}>
      {value}
    </StyledCell>
  );
}


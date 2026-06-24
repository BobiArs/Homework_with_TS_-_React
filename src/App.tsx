import styled from "styled-components";
import { Cell } from "./components/Cell";
import { Status } from "./components/Status";
import { TitleGame } from "./components/TitleGame";
import useGame from "./hooks/useGame";
import { Statistics } from "./components/Statistics";
import { useEffect, useState } from "react";

const formatTime = (timeInSeconds: number): string => {
  const mins = Math.floor(timeInSeconds / 60);
  const secs = timeInSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const GameContainer = styled.div`
  text-align: center;
  margin-left: 230px;
`;

const TimerDisplay = styled.div`
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 500;
`;

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 300px;
  margin: 0 auto;
`;

const ResetButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const GameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

function App() {
  const {
    cells,
    currentPlayer,
    winner,
    winnerCombination,
    isDraw,
    handleCellClick,
    handleReset,
    seconds,
  } = useGame();

  const [gamePlayed, setGamePlayed] = useState(null);
  const [winX, setWinX] = useState(null);
  const [winO, setWinO] = useState(null);
  const [draws, setDraws] = useState(null);

  useEffect(() => {
    if (winner || isDraw) {
      setGamePlayed((p) => p + 1);

      if (winner === "X") setWinX((p) => p + 1);
      if (winner === "O") setWinO((p) => p + 1);
      if (isDraw) setDraws((p) => p + 1);
    }
  }, [winner, isDraw]);

  return (
    <GameWrapper>
      <GameContainer
        id="game"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div>
          <TitleGame title="Гра хрестики нулики" />
          <Status player={currentPlayer} winner={winner} isDraw={isDraw} />
          <TimerDisplay> Час гри: {formatTime(seconds)}</TimerDisplay>
          <BoardGrid>
            {cells.map((cell, index) => (
              <Cell
                value={cell}
                key={index}
                onCellClick={() => handleCellClick(index)}
                isWinner={winnerCombination.includes(index)}
              />
            ))}
          </BoardGrid>
          <ResetButton onClick={handleReset}>Скинути гру</ResetButton>
        </div>
      </GameContainer>
      <Statistics
        gamePlayed={gamePlayed}
        winX={winX}
        winO={winO}
        draws={draws}
      />
    </GameWrapper>
  );
}

export default App;

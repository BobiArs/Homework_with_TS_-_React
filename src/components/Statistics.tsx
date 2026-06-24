import styled from "styled-components";

interface StatisticsProps {
  gamePlayed: number;
  winX: number;
  winO: number;
  draws: number;
}

const StatisticsContainer = styled.div`
  width: 220px;
  max-height: 180px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  overflow-y: auto;
  margin-left: 50px;
`;

const StatisticsItem = styled.p`
  font-size: 1rem;
  margin: 8px 0;
  color: #2c3e50;
`;

export function Statistics({ gamePlayed, winX, winO, draws }: StatisticsProps) {
  return (
    <StatisticsContainer>
      <h3>Статистика ігор</h3>
      <StatisticsItem>Зіграно ігор: {gamePlayed}</StatisticsItem>
      <StatisticsItem>Перемог у X: {winX}</StatisticsItem>
      <StatisticsItem>Перемог у O: {winO}</StatisticsItem>
      <StatisticsItem>І Нічиї: {draws}</StatisticsItem>
    </StatisticsContainer>
  );
}

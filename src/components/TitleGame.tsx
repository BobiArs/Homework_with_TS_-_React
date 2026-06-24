import styled from "styled-components";

interface TitleGameProps {
  title: string;
  age?: number;
}

const StyledTitle = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(45deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: 10px;
`;

export function TitleGame({ title, age }: TitleGameProps) {
  return (
    <StyledTitle>
      {title} {age}
    </StyledTitle>
  );
}


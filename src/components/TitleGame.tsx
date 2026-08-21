import { memo } from "react";

interface TitleGameProps {
  title: string;
}

export function TitleGameComponent({ title }: TitleGameProps) {
  return <h1 className="title">{title}</h1>;
}

export const TitleGame = memo(TitleGameComponent);

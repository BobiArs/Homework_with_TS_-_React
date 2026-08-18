interface TitleGameProps {
  title: string;
}

export function TitleGame({ title }: TitleGameProps) {
  return <h1 className="title">{title}</h1>;
}

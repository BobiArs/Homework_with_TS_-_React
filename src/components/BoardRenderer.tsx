import type { ReactNode } from "react";
import type { CellValue } from "../types";

interface BoardRendererProps {
  items: CellValue[];
  renderItem: (value: CellValue, index: number) => ReactNode;
}

export function BoardRenderer({ items, renderItem }: BoardRendererProps) {
  return (
    <div className="board">
      {items.map((value, index) => renderItem(value, index))}
    </div>
  );
}

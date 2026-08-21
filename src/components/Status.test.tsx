import { render, screen } from "@testing-library/react";
import { Status } from "./Status";
import { describe, it, expect } from "vitest";
 
describe("Status Component (Unit)", () => {
  it("повинен відображати чергу ходу гравця X", () => {
    render(<Status player="X" winner={null} isDraw={false} />);
    expect(screen.getByText(/Хід гравця/)).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("X")).toHaveClass("x-mark");
  });
 
  it("повинен відображати чергу ходу гравця O", () => {
    render(<Status player="O" winner={null} isDraw={false} />);
    expect(screen.getByText(/Хід гравця/)).toBeInTheDocument();
    expect(screen.getByText("O")).toBeInTheDocument();
    expect(screen.getByText("O")).toHaveClass("o-mark");
  });
 
  it("повинен відображати перемогу гравця X", () => {
    render(<Status player="O" winner="X" isDraw={false} />);
    expect(screen.getByText(/Гравець/)).toHaveTextContent("Гравець X переміг!");
    expect(screen.getByText("X")).toHaveClass("x-mark");
  });
 
  it("повинен відображати нічию", () => {
    render(<Status player="X" winner={null} isDraw={true} />);
    expect(screen.getByText("Нічия!")).toBeInTheDocument();
  });
});
 
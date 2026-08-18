import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../context/ThemeContext";
import { Cell } from "./Cell";
import { describe, it, expect, vi } from "vitest";
 
// Допоміжна обгортка з провайдером теми, оскільки Cell викликає useTheme()
const renderCellWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};
 
describe("Cell Component (Unit)", () => {
  it("повинен відображати значення X або O", () => {
    renderCellWithTheme(
      <Cell value="X" onCellClick={vi.fn()} isWinner={false} />
    );
 
    expect(screen.getByText("X")).toBeInTheDocument();
  });
 
  it("повинен мати відповідний клас при виграші", () => {
    renderCellWithTheme(
      <Cell value="O" onCellClick={vi.fn()} isWinner={true} />
    );
 
    const cellElement = screen.getByText("O");
    expect(cellElement).toHaveClass("winner");
    expect(cellElement).toHaveClass("o-mark");
  });
 
  it("повинен викликати onCellClick при кліку на клітинку", async () => {
    const user = userEvent.setup();
    const handleCellClickMock = vi.fn();
 
    renderCellWithTheme(
      <Cell value={null} onCellClick={handleCellClickMock} isWinner={false} />
    );
 
    // Оскільки клітинка порожня, шукаємо її за класом або через селектор
    const cellElement = document.querySelector(".cell")!;
    await user.click(cellElement);
 
    expect(handleCellClickMock).toHaveBeenCalledTimes(1);
  });
});

// Комонент APP + ThemeContext

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import { describe, it, expect } from "vitest";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("Інтеграція ThemeProvider з компонентом App", () => {
  const user = userEvent.setup();

  it("повинен змінювати тему оформлення при кліку", async () => {
    renderWithTheme(<App />);

    const themeBtn = screen.getByRole("button", { name: /темна тема/i });
    await user.click(themeBtn);

    expect(
      screen.getByRole("button", { name: /світла тема/i }),
    ).toBeInTheDocument();

    const gameDiv = screen.getByText("Гра хрестики нулики").closest(".game");

    expect(gameDiv).toHaveClass("dark");
  });
});

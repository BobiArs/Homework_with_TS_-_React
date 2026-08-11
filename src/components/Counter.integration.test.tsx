import { render, screen, cleanup } from "@testing-library/react";
import { Counter } from "./Counter";
import userEvent from "@testing-library/user-event";

describe("Counter component - Integration tests", () => {
  afterEach(() => {
    cleanup();
  });

  test("початковий стан: лічильник = 0, кнопки відображаються", () => {
    render(<Counter />);
    expect(screen.getByTestId("count-value")).toHaveTextContent("0");
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "-" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Скинути" })).toBeInTheDocument();
  });

  test("збільшення та зменшення значення", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "+" });
    const decrementButton = screen.getByRole("button", { name: "-" });
    await user.click(incrementButton);
    expect(screen.getByTestId("count-value")).toHaveTextContent("1");

    await user.click(decrementButton);
    expect(screen.getByTestId("count-value")).toHaveTextContent("0");
  });

  test("логіка історії: додаються попередні значення, максимум 5", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "+" });

    for (let i = 1; i <= 6; i++) {
      await user.click(incrementButton);
    }
    expect(screen.getByTestId("count-value")).toHaveTextContent("6");

    const historyItems = screen.getAllByRole("listitem");
    expect(historyItems).toHaveLength(5);
    expect(historyItems.map((li) => li.textContent)).toEqual([
      "2",
      "3",
      "4",
      "5",
      "6",
    ]);
  });

  test("кнопка 'Скинути' повертає значення до 0 та очищує історію", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "+" });
    const resetButton = screen.getByRole("button", { name: "Скинути" });
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(resetButton);

    expect(screen.getByTestId("count-value")).toHaveTextContent("0");
    expect(screen.getByRole("list")).toBeEmptyDOMElement();
  });
});

import { Counter } from "./Counter";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Counter component - Unit tests", () => {
  afterEach(() => {
    cleanup();
  });

  test("рендерить початкове значення та порожню історію", () => {
    render(<Counter />);
    expect(screen.getByTestId("count-value")).toHaveTextContent("0");
    // Перевіряємо, що список історії присутній, але порожній
    const historyList = screen.getByRole("list");
    expect(historyList).toBeInTheDocument();
    expect(historyList).toBeEmptyDOMElement();
  });

  test("історія відображає останні 5 значень лічильника", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "+" });
    const decrementButton = screen.getByRole("button", { name: "-" });

    // Збільшуємо лічильник кілька разів, щоб сформувати історію
    // Перевіряємо, що історія містить максимум останні 5 значень
    for (let i = 1; i <= 7; i++) {
      await user.click(incrementButton);
    }
    // Лічильник має бути 7
    expect(screen.getByTestId("count-value")).toHaveTextContent("7");

    // Історія повинна містити останні 5 значень: [3, 4, 5, 6, 7]
    let historyItems = screen.getAllByRole("listitem");
    expect(historyItems).toHaveLength(5);
    expect(historyItems.map((item) => item.textContent)).toEqual([
      "3",
      "4",
      "5",
      "6",
      "7",
    ]);

    // Зменшуємо лічильник
    await user.click(decrementButton); // Лічильник стає 6
    expect(screen.getByTestId("count-value")).toHaveTextContent("6");
    historyItems = screen.getAllByRole("listitem");
    expect(historyItems).toHaveLength(5);
    expect(historyItems.map((item) => item.textContent)).toEqual([
      "4",
      "5",
      "6",
      "7",
      "6",
    ]);
  });

  test("кнопка 'Скинути' повертає лічильник до 0 та очищує історію", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "+" });
    const resetButton = screen.getByRole("button", { name: "Скинути" });

    // Збільшуємо лічильник кілька разів, щоб заповнити історію
    await user.click(incrementButton); // count: 1, history: [1]
    await user.click(incrementButton); // count: 2, history: [1, 2]

    // Натискаємо кнопку скидання
    await user.click(resetButton);
    expect(screen.getByTestId("count-value")).toHaveTextContent("0");
    expect(screen.getByRole("list")).toBeEmptyDOMElement(); // Історія має бути порожньою
  });
});

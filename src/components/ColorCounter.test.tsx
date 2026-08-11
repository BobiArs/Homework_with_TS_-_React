import { render, screen, cleanup } from "@testing-library/react";
import { ColorCounter } from "./ColorCounter";
import userEvent from "@testing-library/user-event";

describe("ColorCounter component - Integration tests", () => {
  afterEach(() => {
    cleanup();
  });

  test("початковий стан: лічильник = 0, кнопки відображаються", () => {
    render(<ColorCounter />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "-" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Скинути" })
    ).toBeInTheDocument();
  });

  test("збільшення та зменшення значення", async () => {
    const user = userEvent.setup();
    render(<ColorCounter />);

    const incrementButton = screen.getByRole("button", { name: "+" });
    const decrementButton = screen.getByRole("button", { name: "-" });

    await user.click(incrementButton);
    expect(screen.getByText("1")).toBeInTheDocument();

    await user.click(decrementButton);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("перемикач кольорів: клік на колір змінює стиль лічильника", async () => {
    const user = userEvent.setup();
    render(<ColorCounter />);

    // Початковий колір — black
    const countValue = screen.getByText("0");
    expect(countValue).toHaveStyle({ color: "rgb(0, 0, 0)" });

    // Клікаємо на червоний колір
    await user.click(screen.getByRole("button", { name: "red" }));
    expect(countValue).toHaveStyle({ color: "rgb(255, 0, 0)" });

    // Клікаємо на синій колір
    await user.click(screen.getByRole("button", { name: "blue" }));
    expect(countValue).toHaveStyle({ color: "rgb(0, 0, 255)" });
  });

  test("кнопка 'Скинути' повертає лічильник до 0", async () => {
    const user = userEvent.setup();
    render(<ColorCounter />);

    const incrementButton = screen.getByRole("button", { name: "+" });
    const resetButton = screen.getByRole("button", { name: "Скинути" });

    await user.click(incrementButton);
    await user.click(incrementButton);
    expect(screen.getByText("2")).toBeInTheDocument();

    await user.click(resetButton);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import useGame, { checkWinner } from "./useGame";
import type { BoardState } from "../types";

describe("Тестування утиліти checkWinner (Unit)", () => {
  it("Перевірка поверення null, при старті гри", () => {
    const board: BoardState = Array(9).fill(null);

    expect(checkWinner(board)).toBeNull();
  });

  it("повинен повертати переможця та виграшну комбінацію по горизонталі", () => {
    let board: BoardState = ["X", "X", "X", null, "O", "X", null, "O", "O"];

    expect(checkWinner(board)).toEqual({
      winner: "X",
      combination: [0, 1, 2],
    });
  });
});

describe("Тестування хука useGame (Unit)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("повинен повертати початковий стан гри, а саме стан поля, таймера і поточного гравця", () => {
    const { result } = renderHook(() => useGame());

    expect(result.current.cells).toEqual(Array(9).fill(null));
    expect(result.current.currentPlayer).toBe("X");
    expect(result.current.winner).toBeNull();
    expect(result.current.seconds).toBe(0);
    expect(result.current.winnerCombination).toEqual([]);
    expect(result.current.isDraw).toBe(false);
  });

  it("оновлення ігрового поля та перемикання гравця при кліку", () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.handleCellClick(0);
    });

    expect(result.current.cells[0]).toBe("X");
    expect(result.current.currentPlayer).toBe("O");
  });

  it("повинен зупиняти таймер та оголошувати переможцiв при оголошеннi X?", () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.handleCellClick(0);
    })
    act(() => {
      result.current.handleCellClick(3);
    })
    act(() => {
      result.current.handleCellClick(1);
    })
    act(() => {
      result.current.handleCellClick(4);
    })
    act(() => {
      result.current.handleCellClick(2);
    })

    expect(result.current.winner).toBe("X");
    expect(result.current.winnerCombination).toEqual([0,1,2]);

    const timeAtWin = result.current.seconds;
    act(()=>{
      vi.advanceTimersByTime(2000);
    })
    expect(result.current.seconds).toBe(timeAtWin);
  });
});

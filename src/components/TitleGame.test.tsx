import { render, screen } from "@testing-library/react";
import { TitleGame } from "./TitleGame";
import { describe, it, expect } from "vitest";

describe("Тестування компонента TitleGame", ()=>{
    it("Повинен рендерити переданий заголовок", ()=>{
        render(<TitleGame title="Тестовий щааголовок гри"/>)
        const headingElement = screen.getByRole('heading', {level:1});

        expect(headingElement).toBeInTheDocument();
        expect(headingElement).toHaveTextContent("Тестовий щааголовок гри");
        expect(headingElement).toHaveClass("title");
    })
})
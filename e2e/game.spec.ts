import { test, expect } from "@playwright/test";

test.describe("Tic-Tac-Toe Game (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("повинен дозволяти грати повну партію, де X перемагає, та скидати гру", async ({
    page,
  }) => {
    // 1. Перевіряємо початковий стан
    await expect(page.locator("h1")).toHaveText("Гра хрестики нулики");
    await expect(page.locator(".turn")).toHaveText("Хід гравця X");

    // Отримуємо всі клітинки ігрового поля
    const cells = page.locator(".board .cell");
    await expect(cells).toHaveCount(9);

    // 2. Робимо виграшні ходи для X (по діагоналі 0 -> 4 -> 8)
    // Хід Х - клітинка 0
    await cells.nth(0).click();
    await expect(page.locator(".turn")).toHaveText("Хід гравця O");

    // Хід О - клітинка 1
    await cells.nth(1).click();
    await expect(page.locator(".turn")).toHaveText("Хід гравця X");

    // Хід Х - клітинка 4 (центр)
    await cells.nth(4).click();

    // Хід О - клітинка 2
    await cells.nth(2).click();

    // Хід Х - клітинка 8 (виграш)
    await cells.nth(8).click();

    // 3. Перевіряємо оголошення результату
    await expect(page.locator(".turn")).toHaveText("Гравець X переміг!");

    // 4. Перевіряємо скидання гри
    await page.getByRole("button", { name: /скинути гру/i }).click();
    await expect(page.locator(".turn")).toHaveText("Хід гравця O"); // хід переходить до O після поразки

    // Перевіряємо, що всі клітинки очистилися
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toBeEmpty();
    }
  });
});

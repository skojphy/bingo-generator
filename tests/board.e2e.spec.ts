import { test, expect } from '@playwright/test';

test.describe('빙고판 UI E2E', () => {
  test('빙고판이 5x5 그리드로 렌더링되고, 입력/스타일 커스텀 동작', async ({ page }) => {
    await page.goto('/');
    // 25개의 textarea(cell-input) 존재
    const cells = await page.locator('textarea.cell-input');
    await expect(cells).toHaveCount(25);

    // 첫 번째 칸에 입력
    await cells.nth(0).fill('테스트 방');
    await expect(cells.nth(0)).toHaveValue('테스트 방');

    // 스타일 커스텀: 글자색, 배경색, 폰트
    const colorInput = page.locator('input[type="color"]').first();
    const bgColorInput = page.locator('input[type="color"]').nth(1);
    const fontSelect = page.locator('select');

    await colorInput.fill('#ff0000');
    await bgColorInput.fill('#00ff00');
    await fontSelect.selectOption('monospace');

    // 스타일이 실제로 적용되는지 확인 (간단히 배경색, 폰트)
    const board = page.locator('.board-grid');
    await expect(board).toHaveCSS('background-color', 'rgb(0, 255, 0)');
    await expect(board).toHaveCSS('font-family', /monospace/);
  });
});

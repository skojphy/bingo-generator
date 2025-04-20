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
    // 컬러피커 기반으로 수정
    // 글자색(ColorPicker 첫 번째)
    await page.locator('label:has-text("글자색") .color').first().click();
    const 글자색Popup = page.locator('.wrapper[role="dialog"]:visible');
    await 글자색Popup.waitFor({ state: 'visible' });
    const 글자색HexInput = 글자색Popup.locator('input[aria-label="hex color"]');
    await 글자색HexInput.waitFor({ state: 'visible' });
    await 글자색HexInput.fill('#ff0000');
    await page.keyboard.press('Enter');

    // 배경색(ColorPicker 두 번째)
    await page.locator('label:has-text("배경색") .color').first().click();
    const 배경색Popup = page.locator('.wrapper[role="dialog"]:visible');
    await 배경색Popup.waitFor({ state: 'visible' });
    const 배경색HexInput = 배경색Popup.locator('input[aria-label="hex color"]');
    await 배경색HexInput.waitFor({ state: 'visible' });
    await 배경색HexInput.fill('#00ff00');
    await page.keyboard.press('Enter');

    // 폰트
    const fontSelect = page.locator('select');
    await fontSelect.selectOption('monospace');

    // 스타일이 실제로 적용되는지 확인 (간단히 배경색, 폰트)
    const board = page.locator('.board-grid');
    await expect(board).toHaveCSS('background-color', 'rgb(0, 255, 0)');
    await expect(board).toHaveCSS('font-family', /monospace/);
  });

  test('셀 테두리 토글 동작', async ({ page }) => {
    await page.goto('/');

    // "셀 테두리 표시" 토글이 존재
    const borderToggle = page.getByLabel('셀 테두리 표시');
    await expect(borderToggle).toBeVisible();

    // 토글을 끄면 → 모든 셀의 border가 없어짐
    await borderToggle.uncheck();
    const cell = page.locator('.cell').first();
    await expect(cell).toBeVisible(); // 셀 존재/렌더링을 먼저 보장
    await expect(cell).toHaveCSS('border-style', 'none');

    // 토글을 다시 켜면 → border가 다시 생김
    await borderToggle.check();
    await expect(cell).toBeVisible(); // 셀 존재/렌더링을 먼저 보장
    await expect(cell).not.toHaveCSS('border-style', 'none');
  });
});

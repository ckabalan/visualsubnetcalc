import { test, expect } from '@playwright/test';

test('CIDR Input Typing', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Network Address').click();
  await page.getByLabel('Network Address').press('End');
  await page.getByLabel('Network Address').press('Shift+Home');
  await page.getByLabel('Network Address').press('Delete');
  await page.keyboard.type('192.168.0.0/24');
  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.getByRole('cell', { name: '192.168.0.0/24 Subnet Address' })).toContainText('192.168.0.0/24');
});

test('CIDR Input Paste', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Network Address').click();
  await page.getByLabel('Network Address').press('End');
  await page.getByLabel('Network Address').press('Shift+Home');
  // From: https://github.com/microsoft/playwright/issues/2511
  await page.locator('#network').evaluate((formEl) => {
    const data = `172.16.0.0/12`;
    const clipboardData = new DataTransfer();
    const dataType = 'text/plain';
    clipboardData.setData(dataType, data);
    const clipboardEvent = new ClipboardEvent('paste', {
      clipboardData,
      dataType,
      data
    });
    formEl.dispatchEvent(clipboardEvent);
  });

  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.getByRole('cell', { name: '172.16.0.0/12 Subnet Address' })).toContainText('172.16.0.0/12');
});

test('About Dialog', async ({ page }) => {
  await page.goto('/');
  await page.locator('#info_icon').click();
  await expect(page.locator('#aboutModalLabel')).toContainText('About Visual Subnet Calculator');
  await expect(page.getByLabel('About Visual Subnet Calculator')).toContainText('Design Tenets');
  await expect(page.getByLabel('About Visual Subnet Calculator')).toContainText('Credits');
  await expect(page.getByLabel('About Visual Subnet Calculator').getByText('Close')).toBeVisible();
});

test('GitHub Link', async ({ page }) => {
  await page.goto('/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByLabel('GitHub').click();
  const page1 = await page1Promise;
  await expect(page1.locator('#repository-container-header')).toContainText('ckabalan / visualsubnetcalc Public');
});

test('Table Header Standard Mode', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#useableHeader')).toContainText('Usable IPs');
});

test('Table Header AWS Mode', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#useableHeader')).toContainText('Usable IPs');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - AWS' }).click();
  await expect(page.getByRole('cell', { name: 'Usable IPs', exact: true })).toContainText('Usable IPs (AWS)');
  await page.getByRole('link', { name: 'AWS' }).hover()
  await expect(page.getByText('AWS reserves 5 addresses in')).toBeVisible();
});

test('Table Header Azure Mode', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#useableHeader')).toContainText('Usable IPs');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - Azure' }).click();
  await expect(page.getByRole('cell', { name: 'Usable IPs', exact: true })).toContainText('Usable IPs (Azure)');
  await page.getByRole('link', { name: 'Azure' }).hover()
  await expect(page.getByText('Azure reserves 5 addresses in')).toBeVisible();
});

test('Table Header OCI Mode', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#useableHeader')).toContainText('Usable IPs');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - OCI' }).click();
  await expect(page.getByRole('cell', { name: 'Usable IPs', exact: true })).toContainText('Usable IPs (OCI)');
  await page.getByRole('link', { name: 'OCI' }).hover()
  await expect(page.getByText('OCI reserves 3 addresses in')).toBeVisible();
});

test('Table Header AWS then Standard', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#useableHeader')).toContainText('Usable IPs');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - AWS' }).click();
  await expect(page.getByRole('cell', { name: 'Usable IPs', exact: true })).toContainText('Usable IPs (AWS)');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - Standard' }).click();
  await expect(page.getByRole('cell', { name: 'Usable IPs', exact: true })).toContainText('Usable IPs');
  await expect(page.getByRole('cell', { name: 'Usable IPs', exact: true })).not.toContainText('(AWS)');
});

test('Color Palette', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Change Colors').locator('span')).toContainText('Change Colors »');
  await page.getByText('Change Colors »').click();
  await expect(page.getByLabel('Color 1', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Color 2', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Color 3', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Color 4', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Color 5', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Color 6', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Color 7', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Color 8', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Color 9', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Color 10', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Stop Changing Colors').locator('span')).toContainText('« Stop Changing Colors');
  await page.getByText('« Stop Changing Colors').click();
  await expect(page.getByLabel('Change Colors').locator('span')).toContainText('Change Colors »');
});

test('Test Default Colors', async ({ page }) => {
  await page.goto('/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9GgGwIgDOUoGA5hSBgBa0YCWTAVkwNYUC+ia3SMB590HIbEHDEAZikjRaVhJjjQAFnmIArPNEy1IQlpAB2PSP6MVyjYYAcJgJx6dhzCbQDelkDNtG7jCecj6Ipu6avPy6PgoiQA');
  await page.getByText('Change Colors »').click();
  // Set the top 10 rows to the default colors and check that they are correct
  await page.getByLabel('Color 1', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.0.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.0.0/20' })).toHaveCSS('background-color', 'rgb(255, 173, 173)');
  await page.getByLabel('Color 2', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.16.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.16.0/20' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  await page.getByLabel('Color 3', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.32.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.32.0/20' })).toHaveCSS('background-color', 'rgb(253, 255, 182)');
  await page.getByLabel('Color 4', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.48.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.48.0/20' })).toHaveCSS('background-color', 'rgb(202, 255, 191)');
  await page.getByLabel('Color 5', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.64.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.64.0/20' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
  await page.getByLabel('Color 6', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.80.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.80.0/20' })).toHaveCSS('background-color', 'rgb(160, 196, 255)');
  await page.getByLabel('Color 7', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.96.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.96.0/20' })).toHaveCSS('background-color', 'rgb(189, 178, 255)');
  await page.getByLabel('Color 8', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.112.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.112.0/20' })).toHaveCSS('background-color', 'rgb(255, 198, 255)');
  await page.getByLabel('Color 9', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.128.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.128.0/20' })).toHaveCSS('background-color', 'rgb(230, 230, 230)');
  await page.getByLabel('Color 10', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.144.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.144.0/20' })).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  // Set rows 11 and 12 to Colors 1 and 2 respectively and check that they are correct
  await page.getByLabel('Color 1', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.160.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.160.0/20' })).toHaveCSS('background-color', 'rgb(255, 173, 173)');
  await page.getByLabel('Color 2', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.176.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.176.0/20' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  // Set rows 11 and 12 to Color 10 (white) to make sure you can change colors later
  await page.getByLabel('Color 10', { exact: true }).click();
  await page.getByRole('cell', { name: '10.0.160.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.160.0/20' })).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.getByRole('cell', { name: '10.0.176.0/20 Subnet Address' }).click();
  await expect(page.getByRole('row', { name: '10.0.176.0/20' })).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.getByText('« Stop Changing Colors').click();
  // Make sure when you're not in color change mode you cannot change colors
  await page.getByRole('cell', { name: '10.0.0.0/20 Subnet Address' }).click();
  // Should still be the old color instead of white (the last palette color selected)
  await expect(page.getByRole('row', { name: '10.0.0.0/20' })).toHaveCSS('background-color', 'rgb(255, 173, 173)');
});






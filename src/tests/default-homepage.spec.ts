import { test, expect } from '@playwright/test';

test('Default Homepage Rendering', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await expect(page).toHaveTitle(/Visual Subnet Calculator/);
  await expect(page.getByRole('heading')).toContainText('Visual Subnet Calculator');
  await expect(page.getByLabel('Network Address')).toHaveValue('10.0.0.0');
  await expect(page.getByLabel('Network Size')).toHaveValue('16');
  await expect(page.locator('#useableHeader')).toContainText('Usable IPs');
  await expect(page.getByLabel('10.0.0.0/16', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.0.0/16');
  await expect(page.getByLabel('10.0.0.0/16', { exact: true }).getByLabel('Range of Addresses')).toContainText('10.0.0.0 - 10.0.255.255');
  await expect(page.getByLabel('10.0.0.0/16', { exact: true }).getByLabel('Usable IPs')).toContainText('10.0.0.1 - 10.0.255.254');
  await expect(page.getByLabel('10.0.0.0/16', { exact: true }).getByLabel('Hosts')).toContainText('65534');
  await expect(page.getByRole('textbox', { name: '10.0.0.0/16 Note' })).toBeEmpty();
  await expect(page.getByLabel('10.0.0.0/16', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/16');
  // This "default no color" check could maybe be improved. May not be reliable cross-browser.
  await expect(page.getByRole('row', { name: '10.0.0.0/16' })).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByLabel('Change Colors').locator('span')).toContainText('Change Colors »');
  await expect(page.locator('#copy_url')).toContainText('Copy Shareable URL');
});



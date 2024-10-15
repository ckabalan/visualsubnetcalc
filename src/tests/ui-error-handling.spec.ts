import { test, expect } from '@playwright/test';

test('Bad Network Address', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Network Address').click();
  await page.getByLabel('Network Address').fill('1');
  await page.locator('html').click();
  await expect(page.locator('#network')).toHaveClass(/error/i);
  await expect(page.getByText('Must be a valid IPv4 Address')).toBeVisible();
});

test('Bad Network Size', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Network Size').click();
  await page.getByLabel('Network Size').fill('33');
  await page.locator('html').click();
  await expect(page.locator('#netsize')).toHaveClass(/error/i);
  await expect(page.getByText('Smallest size is /32')).toBeVisible();
});

test('Prevent Go on Bad Input', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Network Size').click();
  await page.getByLabel('Network Size').fill('33');
  await page.locator('html').click();
  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.locator('#notifyModalLabel')).toContainText('Warning!');
  await expect(page.locator('#notifyModalDescription')).toContainText('Please correct the errors in the form!');
});


test('Network Boundary Correction', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Network Address').click();
  await page.getByLabel('Network Address').fill('123.45.67.89');
  await page.getByLabel('Network Size').click();
  await page.getByLabel('Network Size').fill('20');
  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.locator('#notifyModalLabel')).toContainText('Warning!');
  await expect(page.locator('#notifyModalDescription')).toContainText('Your network input is not on a network boundary for this network size. It has been automatically changed:');
  await expect(page.locator('#notifyModalDescription')).toContainText('123.45.67.89 -> 123.45.64.0');
  await page.getByLabel('Warning!').getByLabel('Close').click();
  await expect(page.getByLabel('Network Address')).toHaveValue('123.45.64.0');
  await page.getByLabel('Network Size').click();
  await expect(page.getByRole('cell', { name: '123.45.64.0/20 Subnet Address' })).toContainText('123.45.64.0/20');
  await page.getByRole('cell', { name: '/20 Split' }).click();
  await page.getByLabel('/20 Join').click();
  await expect(page.getByLabel('123.45.64.0/20', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/20');
});

test('Subnet Too Small for AWS Mode', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#useableHeader')).toContainText('Usable IPs');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - AWS' }).click();
  await page.getByLabel('Network Size').click();
  await page.getByLabel('Network Size').fill('29');
  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.locator('#notifyModalLabel')).toContainText('Warning!');
  await expect(page.locator('#notifyModalDescription')).toContainText('Please correct the errors in the form!');
  await expect(page.getByText('AWS Mode - Smallest size is /28')).toBeVisible();
});

test('Subnet Too Small for Azure Mode', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#useableHeader')).toContainText('Usable IPs');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - Azure' }).click();
  await page.getByLabel('Network Size').click();
  await page.getByLabel('Network Size').fill('30');
  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.locator('#notifyModalLabel')).toContainText('Warning!');
  await expect(page.locator('#notifyModalDescription')).toContainText('Please correct the errors in the form!');
  await expect(page.getByText('Azure Mode - Smallest size is /29')).toBeVisible();
});


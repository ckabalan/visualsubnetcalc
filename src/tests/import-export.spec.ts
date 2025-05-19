import { test, expect } from '@playwright/test';

test('Default Export Content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Import / Export' }).click();
  await expect(page.locator('#importExportModalLabel')).toContainText('Import/Export');
  await expect(page.getByLabel('Import/Export', { exact: true })).toContainText('Close');
  await expect(page.locator('#importBtn')).toContainText('Import');
  await expect(page.getByLabel('Import/Export Content')).toHaveValue('{\n  "config_version": "2",\n  "base_network": "10.0.0.0/16",\n  "subnets": {\n    "10.0.0.0/16": {}\n  }\n}');
});

test('Default (AWS) Export Content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - AWS' }).click();
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Import / Export' }).click();
  await expect(page.getByLabel('Import/Export Content')).toHaveValue('{\n  "config_version": "2",\n  "operating_mode": "AWS",\n  "base_network": "10.0.0.0/16",\n  "subnets": {\n    "10.0.0.0/16": {}\n  }\n}');
});

test('Default (Azure) Export Content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - Azure' }).click();
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Import / Export' }).click();
  await expect(page.getByLabel('Import/Export Content')).toHaveValue('{\n  "config_version": "2",\n  "operating_mode": "AZURE",\n  "base_network": "10.0.0.0/16",\n  "subnets": {\n    "10.0.0.0/16": {}\n  }\n}');
  await page.getByLabel('Import/Export', { exact: true }).getByText('Close').click();
});

test('Default (OCI) Export Content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - OCI' }).click();
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Import / Export' }).click();
  await expect(page.getByLabel('Import/Export Content')).toHaveValue('{\n  "config_version": "2",\n  "operating_mode": "OCI",\n  "base_network": "10.0.0.0/16",\n  "subnets": {\n    "10.0.0.0/16": {}\n  }\n}');
  //await page.getByLabel('Import/Export', { exact: true }).getByText('Close').click();
});

test('Import 192.168.0.0/24', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Import / Export' }).click();
  await page.getByLabel('Import/Export Content').click();
  await page.getByLabel('Import/Export Content').fill('{\n  "config_version": "2",\n  "base_network": "192.168.0.0/24",\n  "subnets": {\n    "192.168.0.0/24": {}\n  }\n}');
  await page.getByRole('button', { name: 'Import' }).click();
  await expect(page.getByLabel('Network Address')).toHaveValue('192.168.0.0');
  await expect(page.getByLabel('Network Size')).toHaveValue('24');
  await expect(page.getByLabel('192.168.0.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('192.168.0.0/24');
});

//test('Test', async ({ page }) => {
//  await page.goto('/');
//});


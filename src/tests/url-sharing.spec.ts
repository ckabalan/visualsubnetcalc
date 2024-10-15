import { test, expect } from '@playwright/test';

async function getClipboardText(page) {
  return page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
}

test('Default URL Share', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await page.getByText('Copy Shareable URL').click();
  const clipboardUrl = await getClipboardText(page);
  expect(clipboardUrl).toContain('/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9GgGwIgDOUoGA5hQL71A');
});

test('Default URL Render', async ({ page }) => {
  // This should match default-homepage.spec.ts
  await page.goto('https://127.0.0.1:8443/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9GgGwIgDOUoGA5hQL71A');
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

test('Reddit Example URL Render (URL v1 - Config v1)', async ({ page }) => {
  // This is great to make sure older URLs still load and render properly
  await page.goto('https://127.0.0.1:8443/index.html?c=1N4IgbiBcIIwgNCAzlUMAMA6LOD0AmdVWHbbAuSNUvffYjM2gZgZvPwBZiB9AOyggAIgEMALiIAEAYQCmfMbIBOkgLSSAagEslYgK4iANpIDKysMpSIeAY0EBiAJwAjAGYA2V65ABfRIywYDm4qEH5BUQkZeUUVdW1dA2MzJQslKzC7aCc3T28fPxIyfA5WUIDMEvQCENBw6EipOQVlNU0dfSNTc0sETIcXDy9ff1JmYN4BBvEmmNb1AAUACwBPJC0bLpS0jNsHEXQbTmGCworODnpy0gvq-DK6qZAAIT0tQwATLT4Ac0kAQTaAHUtK4tH09tkvB93CIAKwjIpYdylSaCV7vL6-AFtAAy-wAchCsiB7NDYQjTqMyAAODiUai0y5sJl3B5IzB0u61MJPDGfb5-QGLJTfWK7Elk1ww+GIiqOCaheovN4C7HCzQAew2smJDnJsoK1MCLDR0H5WL+z2BoPB1kl0q8zncvjOpBgVQIV0ZgU99zNKsxgsk1vU+KJ9v1HydLrdZBgtwI7IqCcVj3RqstIbaC1FLXSeqh0dczrl7rhad5GaD2NDWp1hdJjpLsdOpyAA');
  await expect(page.getByLabel('Network Address')).toHaveValue('10.0.0.0');
  await expect(page.getByLabel('Network Size')).toHaveValue('20');
  await expect(page.getByLabel('10.0.0.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.0.0/24');
  await expect(page.getByLabel('10.0.1.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.1.0/24');
  await expect(page.getByLabel('10.0.2.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.2.0/24');
  await expect(page.getByLabel('10.0.3.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.3.0/24');
  await expect(page.getByLabel('10.0.4.0/23', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.4.0/23');
  await expect(page.getByLabel('10.0.6.0/23', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.6.0/23');
  await expect(page.getByLabel('10.0.8.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.8.0/24');
  await expect(page.getByLabel('10.0.9.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.9.0/24');
  await expect(page.getByLabel('10.0.10.0/23', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.10.0/23');
  await expect(page.getByLabel('10.0.12.0/23', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.12.0/23');
  await expect(page.getByLabel('10.0.14.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.14.0/24');
  await expect(page.getByLabel('10.0.15.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.15.0/24');
  await expect(page.getByRole('textbox', { name: '10.0.0.0/24 Note' })).toHaveValue('Data Center - Virtual Servers');
  await expect(page.getByRole('textbox', { name: '10.0.1.0/24 Note' })).toHaveValue('Data Center - Virtual Servers');
  await expect(page.getByRole('textbox', { name: '10.0.2.0/24 Note' })).toHaveValue('Data Center - Virtual Servers');
  await expect(page.getByRole('textbox', { name: '10.0.3.0/24 Note' })).toHaveValue('Data Center - Physical Servers');
  await expect(page.getByRole('textbox', { name: '10.0.4.0/23 Note' })).toHaveValue('Building A - Wifi');
  await expect(page.getByRole('textbox', { name: '10.0.6.0/23 Note' })).toHaveValue('Building A - LAN');
  await expect(page.getByRole('textbox', { name: '10.0.8.0/24 Note' })).toHaveValue('Building A - Printers');
  await expect(page.getByRole('textbox', { name: '10.0.9.0/24 Note' })).toHaveValue('Building A - Voice');
  await expect(page.getByRole('textbox', { name: '10.0.10.0/23 Note' })).toHaveValue('Building B - Wifi');
  await expect(page.getByRole('textbox', { name: '10.0.12.0/23 Note' })).toHaveValue('Building B - LAN');
  await expect(page.getByRole('textbox', { name: '10.0.14.0/24 Note' })).toHaveValue('Building B - Printers');
  await expect(page.getByRole('textbox', { name: '10.0.15.0/24 Note' })).toHaveValue('Building B - Voice');
  await expect(page.getByRole('row', { name: '10.0.0.0/24' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
  await expect(page.getByRole('row', { name: '10.0.1.0/24' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
  await expect(page.getByRole('row', { name: '10.0.2.0/24' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
  await expect(page.getByRole('row', { name: '10.0.3.0/24' })).toHaveCSS('background-color', 'rgb(160, 196, 255)');
  await expect(page.getByRole('row', { name: '10.0.4.0/23' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  await expect(page.getByRole('row', { name: '10.0.6.0/23' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  await expect(page.getByRole('row', { name: '10.0.8.0/24' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  await expect(page.getByRole('row', { name: '10.0.9.0/24' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  await expect(page.getByRole('row', { name: '10.0.10.0/23' })).toHaveCSS('background-color', 'rgb(253, 255, 182)');
  await expect(page.getByRole('row', { name: '10.0.12.0/23' })).toHaveCSS('background-color', 'rgb(253, 255, 182)');
  await expect(page.getByRole('row', { name: '10.0.14.0/24' })).toHaveCSS('background-color', 'rgb(253, 255, 182)');
  await expect(page.getByRole('row', { name: '10.0.15.0/24' })).toHaveCSS('background-color', 'rgb(253, 255, 182)');
});

test('Reddit Example URL Conversion (URL v1 - Config v1 to v2)', async ({ page }) => {
  // Basically if a user loads a URL (say v1), we load it, but then only produce the latest version URL (v2) when they copy the URL
  await page.goto('https://127.0.0.1:8443/index.html?c=1N4IgbiBcIIwgNCAzlUMAMA6LOD0AmdVWHbbAuSNUvffYjM2gZgZvPwBZiB9AOyggAIgEMALiIAEAYQCmfMbIBOkgLSSAagEslYgK4iANpIDKysMpSIeAY0EBiAJwAjAGYA2V65ABfRIywYDm4qEH5BUQkZeUUVdW1dA2MzJQslKzC7aCc3T28fPxIyfA5WUIDMEvQCENBw6EipOQVlNU0dfSNTc0sETIcXDy9ff1JmYN4BBvEmmNb1AAUACwBPJC0bLpS0jNsHEXQbTmGCworODnpy0gvq-DK6qZAAIT0tQwATLT4Ac0kAQTaAHUtK4tH09tkvB93CIAKwjIpYdylSaCV7vL6-AFtAAy-wAchCsiB7NDYQjTqMyAAODiUai0y5sJl3B5IzB0u61MJPDGfb5-QGLJTfWK7Elk1ww+GIiqOCaheovN4C7HCzQAew2smJDnJsoK1MCLDR0H5WL+z2BoPB1kl0q8zncvjOpBgVQIV0ZgU99zNKsxgsk1vU+KJ9v1HydLrdZBgtwI7IqCcVj3RqstIbaC1FLXSeqh0dczrl7rhad5GaD2NDWp1hdJjpLsdOpyAA');
  await page.getByText('Copy Shareable URL').click();
  const clipboardUrl = await getClipboardText(page);
  expect(clipboardUrl).toContain('/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9DBgiAM5SgYDW5IGANjRgLaMB2jA9je9ACICGAF34ACAMIBTVoIkAnEQFoRANQCWswQFd+dEQGU5YOWUQBjVAGIAnEgBmANlu2QAX0RoukUDxADh4qRl5JTUNbV0DWSNZExBzaGs7R2cXN3QeUBhPb1Q-UUlpOUUVdS0dfUNjYniQRIcnV0QAZmyQHzyAwuCRAAUACwBPElVTcsjo2JqLfgxTABYG1LS0Fi9YDLbUACFNVToAE1VWAHMRAEFigHVVW1Vqyyd9+34AVkaQJo2fHb3Dk-PigAZM4AOXuCUezzeS3cDDWMFWoDmGwAHK1vrsDkdThclD1ZEcgpMHrYnq93lZ0dtMX8ccVlBwRhJwbVIeTUogXl9qb9sSItlcbnczA99k4kPZXGkmoiQPZudAflj-gKlMCwSKIWLbBL3gB2DZoOZUxU0vmq3oErrErXiyXLF4mkBK2n8+mM0zMzWs7W6pb+oA');
});

test('Reddit Example URL Render (URL v1 - Config v2)', async ({ page }) => {
  // This is great to make sure older URLs still load and render properly
  await page.goto('https://127.0.0.1:8443/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9DBgiAM5SgYDW5IGANjRgLaMB2jA9je9ACICGAF34ACAMIBTVoIkAnEQFoRANQCWswQFd+dEQGU5YOWUQBjVAGIAnEgBmANlu2QAX0RoukUDxADh4qRl5JTUNbV0DWSNZExBzaGs7R2cXN3QeUBhPb1Q-UUlpOUUVdS0dfUNjYniQRIcnV0QAZmyQHzyAwuCRAAUACwBPElVTcsjo2JqLfgxTABYG1LS0Fi9YDLbUACFNVToAE1VWAHMRAEFigHVVW1Vqyyd9+34AVkaQJo2fHb3Dk-PigAZM4AOXuCUezzeS3cDDWMFWoDmGwAHK1vrsDkdThclD1ZEcgpMHrYnq93lZ0dtMX8ccVlBwRhJwbVIeTUogXl9qb9sSItlcbnczA99k4kPZXGkmoiQPZudAflj-gKlMCwSKIWLbBL3gB2DZoOZUxU0vmq3oErrErXiyXLF4mkBK2n8+mM0zMzWs7W6pb+oA');
  await expect(page.getByLabel('Network Address')).toHaveValue('10.0.0.0');
  await expect(page.getByLabel('Network Size')).toHaveValue('20');
  await expect(page.getByLabel('10.0.0.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.0.0/24');
  await expect(page.getByLabel('10.0.1.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.1.0/24');
  await expect(page.getByLabel('10.0.2.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.2.0/24');
  await expect(page.getByLabel('10.0.3.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.3.0/24');
  await expect(page.getByLabel('10.0.4.0/23', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.4.0/23');
  await expect(page.getByLabel('10.0.6.0/23', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.6.0/23');
  await expect(page.getByLabel('10.0.8.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.8.0/24');
  await expect(page.getByLabel('10.0.9.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.9.0/24');
  await expect(page.getByLabel('10.0.10.0/23', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.10.0/23');
  await expect(page.getByLabel('10.0.12.0/23', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.12.0/23');
  await expect(page.getByLabel('10.0.14.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.14.0/24');
  await expect(page.getByLabel('10.0.15.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.15.0/24');
  await expect(page.getByRole('textbox', { name: '10.0.0.0/24 Note' })).toHaveValue('Data Center - Virtual Servers');
  await expect(page.getByRole('textbox', { name: '10.0.1.0/24 Note' })).toHaveValue('Data Center - Virtual Servers');
  await expect(page.getByRole('textbox', { name: '10.0.2.0/24 Note' })).toHaveValue('Data Center - Virtual Servers');
  await expect(page.getByRole('textbox', { name: '10.0.3.0/24 Note' })).toHaveValue('Data Center - Physical Servers');
  await expect(page.getByRole('textbox', { name: '10.0.4.0/23 Note' })).toHaveValue('Building A - Wifi');
  await expect(page.getByRole('textbox', { name: '10.0.6.0/23 Note' })).toHaveValue('Building A - LAN');
  await expect(page.getByRole('textbox', { name: '10.0.8.0/24 Note' })).toHaveValue('Building A - Printers');
  await expect(page.getByRole('textbox', { name: '10.0.9.0/24 Note' })).toHaveValue('Building A - Voice');
  await expect(page.getByRole('textbox', { name: '10.0.10.0/23 Note' })).toHaveValue('Building B - Wifi');
  await expect(page.getByRole('textbox', { name: '10.0.12.0/23 Note' })).toHaveValue('Building B - LAN');
  await expect(page.getByRole('textbox', { name: '10.0.14.0/24 Note' })).toHaveValue('Building B - Printers');
  await expect(page.getByRole('textbox', { name: '10.0.15.0/24 Note' })).toHaveValue('Building B - Voice');
  await expect(page.getByRole('row', { name: '10.0.0.0/24' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
  await expect(page.getByRole('row', { name: '10.0.1.0/24' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
  await expect(page.getByRole('row', { name: '10.0.2.0/24' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
  await expect(page.getByRole('row', { name: '10.0.3.0/24' })).toHaveCSS('background-color', 'rgb(160, 196, 255)');
  await expect(page.getByRole('row', { name: '10.0.4.0/23' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  await expect(page.getByRole('row', { name: '10.0.6.0/23' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  await expect(page.getByRole('row', { name: '10.0.8.0/24' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  await expect(page.getByRole('row', { name: '10.0.9.0/24' })).toHaveCSS('background-color', 'rgb(255, 214, 165)');
  await expect(page.getByRole('row', { name: '10.0.10.0/23' })).toHaveCSS('background-color', 'rgb(253, 255, 182)');
  await expect(page.getByRole('row', { name: '10.0.12.0/23' })).toHaveCSS('background-color', 'rgb(253, 255, 182)');
  await expect(page.getByRole('row', { name: '10.0.14.0/24' })).toHaveCSS('background-color', 'rgb(253, 255, 182)');
  await expect(page.getByRole('row', { name: '10.0.15.0/24' })).toHaveCSS('background-color', 'rgb(253, 255, 182)');
});


//test('Test', async ({ page }) => {
//  await page.goto('https://127.0.0.1:8443/');
//});


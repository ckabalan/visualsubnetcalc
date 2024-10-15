import { test, expect } from '@playwright/test';

async function getClipboardText(page) {
  return page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
}

test('Renders Max Depth /0 to /32', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await page.getByLabel('Network Address').click();
  await page.getByLabel('Network Address').press('Shift+Home');
  await page.getByLabel('Network Address').fill('0.0.0.0');
  await page.getByLabel('Network Address').press('Tab');
  await page.getByLabel('Network Size').fill('0');
  await page.getByRole('button', { name: 'Go' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/0 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/1 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/2 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/3 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/4 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/5 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/6 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/7 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/8 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/9 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/10 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/11 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/12 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/13 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/14 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/15 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/16 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/17 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/18 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/19 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/20 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/21 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/22 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/23 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/24 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/25 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/26 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/27 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/28 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/29 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/30 Split' }).click();
  await page.getByRole('cell', { name: '0.0.0.0/31 Split' }).click();
  await expect(page.getByLabel('0.0.0.0/32', { exact: true }).getByLabel('Subnet Address')).toContainText('0.0.0.0/32');
  await expect(page.getByLabel('0.0.0.0/32', { exact: true }).getByLabel('Range of Addresses')).toContainText('0.0.0.0');
  await expect(page.getByLabel('0.0.0.0/32', { exact: true }).getByLabel('Usable IPs')).toContainText('0.0.0.0');
  await expect(page.getByLabel('0.0.0.0/32', { exact: true }).getByLabel('Hosts')).toContainText('1');
  await expect(page.getByLabel('0.0.0.0/32', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/32');
  await expect(page.getByLabel('/31 Join')).toContainText('/31');
  await expect(page.getByLabel('128.0.0.0/1', { exact: true }).getByLabel('Subnet Address')).toContainText('128.0.0.0/1');
});

test('Change To 192.168.0.0/24', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await page.getByLabel('Network Address').click();
  await page.getByLabel('Network Address').fill('192.168.0.0');
  await page.getByLabel('Network Size').click();
  await page.getByLabel('Network Size').fill('24');
  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.getByLabel('192.168.0.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('192.168.0.0/24');
  await expect(page.getByLabel('192.168.0.0/24', { exact: true }).getByLabel('Range of Addresses')).toContainText('192.168.0.0 - 192.168.0.255');
  await expect(page.getByLabel('192.168.0.0/24', { exact: true }).getByLabel('Usable IPs')).toContainText('192.168.0.1 - 192.168.0.254');
  await expect(page.getByLabel('192.168.0.0/24', { exact: true }).getByLabel('Hosts')).toContainText('254');
  await expect(page.getByLabel('192.168.0.0/24', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/24');
  await expect(page.getByRole('textbox', { name: '192.168.0.0/24 Note' })).toBeEmpty();
});

test('Deep /32 Split', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await page.getByText('/16', { exact: true }).click();
  await page.getByLabel('10.0.128.0/17', { exact: true }).getByText('/17', { exact: true }).click();
  await page.getByLabel('10.0.128.0/18', { exact: true }).getByText('/18', { exact: true }).click();
  await page.getByLabel('10.0.160.0/19', { exact: true }).getByText('/19', { exact: true }).click();
  await page.getByLabel('10.0.176.0/20', { exact: true }).getByText('/20', { exact: true }).click();
  await page.getByLabel('10.0.184.0/21', { exact: true }).getByText('/21', { exact: true }).click();
  await page.getByLabel('10.0.176.0/21', { exact: true }).getByText('/21', { exact: true }).click();
  await page.getByLabel('10.0.176.0/22', { exact: true }).getByText('/22', { exact: true }).click();
  await page.getByLabel('10.0.176.0/23', { exact: true }).getByText('/23', { exact: true }).click();
  await page.getByLabel('10.0.176.0/24', { exact: true }).getByText('/24', { exact: true }).click();
  await page.getByLabel('10.0.176.0/25', { exact: true }).getByText('/25', { exact: true }).click();
  await page.getByLabel('10.0.176.0/26', { exact: true }).getByText('/26', { exact: true }).click();
  await page.getByLabel('10.0.176.0/27', { exact: true }).getByText('/27', { exact: true }).click();
  await page.getByLabel('10.0.176.0/28', { exact: true }).getByText('/28', { exact: true }).click();
  await page.getByLabel('10.0.176.0/29', { exact: true }).getByText('/29', { exact: true }).click();
  await page.getByLabel('10.0.176.0/30', { exact: true }).getByText('/30', { exact: true }).click();
  await page.getByLabel('10.0.176.0/31', { exact: true }).getByText('/31', { exact: true }).click();
  await page.getByRole('textbox', { name: '10.0.176.0/32 Note' }).click();
  await page.getByRole('textbox', { name: '10.0.176.0/32 Note' }).fill('Test Text');
  await page.getByText('Change Colors »').click();
  await page.locator('#palette_picker_6').click();
  await page.getByRole('cell', { name: '10.0.176.0/32 Subnet Address' }).click();
  await page.getByText('« Stop Changing Colors').click();
  await page.getByLabel('Network Address').click();
  await page.getByLabel('Network Address').fill('99.0.0.0');
  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.getByLabel('99.0.176.0/32', { exact: true }).getByLabel('Subnet Address')).toContainText('99.0.176.0/32');
  await expect(page.getByLabel('99.0.176.0/32', { exact: true }).getByLabel('Hosts')).toContainText('1');
  await expect(page.getByRole('textbox', { name: '99.0.176.0/32 Note' })).toHaveValue('Test Text');
  await expect(page.getByLabel('99.0.176.0/32', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/32');
});

test('Usable IPs - Standard', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - Standard' }).click();
  await expect(page.getByLabel('10.0.0.0/16', { exact: true }).getByLabel('Usable IPs')).toContainText('10.0.0.1 - 10.0.255.254');
});

test('Usable IPs - AWS', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - AWS' }).click();
  await expect(page.getByLabel('10.0.0.0/16', { exact: true }).getByLabel('Usable IPs')).toContainText('10.0.0.4 - 10.0.255.254');
});

test('Usable IPs - Azure', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - Azure' }).click();
  await expect(page.getByLabel('10.0.0.0/16', { exact: true }).getByLabel('Usable IPs')).toContainText('10.0.0.4 - 10.0.255.254');
});

test('Note Splitting', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await page.getByLabel('Note Split/Join').click();
  await page.getByLabel('Note Split/Join').fill('This should be duplicated!');
  await page.getByRole('cell', { name: '/16 Split' }).click();
  await expect(page.getByRole('textbox', { name: '10.0.0.0/17 Note' })).toHaveValue('This should be duplicated!');
  await expect(page.getByRole('textbox', { name: '10.0.128.0/17 Note' })).toHaveValue('This should be duplicated!');
});

test('Note Joining Same', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9GgGwIgDOUoGA5hSBgBa0B2qAKvQJakAEp9A9gFcANgBNuSAKbdRggA7COAYwCGAF0miAhCAC+iNI0igW0dl14CR4qTPmLVG7Xt2ugA');
  await page.getByLabel('/16 Join').click();
  await expect(page.getByLabel('Note Split/Join')).toHaveValue('This should be duplicated!');
});

test('Note Joining Different', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9GgGwIgDOUoGA5hSBgBa0B2qAKvQJakAEp9A9gFcANgBNuSAKbdRggA7COAYwCGAF0miAhNwCCIAL6I0jSKBbR2XXgJHipM+YtUbt3AEKGD3oA');
  await page.getByLabel('/16 Join').click();
  await expect(page.getByLabel('Note Split/Join')).toBeEmpty();
});

test('Color Splitting', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/');
  await page.getByText('Change Colors »').click();
  await page.getByLabel('Color 5').click();
  await page.getByRole('cell', { name: '/16 Subnet Address' }).click();
  await page.getByText('« Stop Changing Colors').click();
  await page.getByText('/16', { exact: true }).click();
  await expect(page.getByRole('row', { name: '10.0.0.0/17' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
  await expect(page.getByRole('row', { name: '10.0.128.0/17' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
});

test('Color Joining Same', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9GgGwIgDOUoGA5hSBgBa0DGqAxAJxIBmhXXIAX0RpGkUC2gduvfgLkCgA');
  await page.getByLabel('/16 Join').click();
  await expect(page.getByRole('row', { name: '10.0.0.0/16' })).toHaveCSS('background-color', 'rgb(155, 246, 255)');
});

test('Color Joining Different', async ({ page }) => {
  await page.goto('https://127.0.0.1:8443/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9GgGwIgDOUoGA5hSBgBa0DGqAxAJxIBmhXXIAX0RpGkUC2isuAEz5JiAxQKA');
  await page.getByLabel('/16 Join').click();
  await expect(page.getByRole('row', { name: '10.0.0.0/16' })).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

//test('Test', async ({ page }) => {
//  await page.goto('https://127.0.0.1:8443/');
//});

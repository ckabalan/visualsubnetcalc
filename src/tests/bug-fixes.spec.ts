import { test, expect } from '@playwright/test';

test('#22 - Broken Order/Render From URL Import', async ({ page }) => {
  await page.goto('/index.html?c=1N4IgbiBcIEwgNCARlEBGADAOm7g9ABwIgDOUoGRkoaAnObAIYMAsK1IBAxg2gGwATcgF9EaAOxDqw0SFo8OaAlOCy6KmbICs7GhgWgYGDYhhoNatAdgwTsAMwWZie8w59d6GNZgs7MLQsxex9BEVNJEWcQcU80Fh9lcNhaIPQta3tjZPtzKM1EDHoODDcKT30GbJKAUyqAM2S0Ruk1Oo4YFtUXLpA+AHNk8UHW6LzWsR87R3yxT29WO0Col2sw6URI0bUy2E8EhiSNuTSM3mru9HHVaPtPPms0WyaZiZjHvybl7c1hIA');
  await expect(page.getByLabel('10.0.0.0/15', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.0.0/15');
  await expect(page.getByLabel('10.2.0.0/15', { exact: true }).getByLabel('Subnet Address')).toContainText('10.2.0.0/15');
  await expect(page.getByLabel('10.4.0.0/15', { exact: true }).getByLabel('Subnet Address')).toContainText('10.4.0.0/15');
  await expect(page.getByLabel('10.6.0.0/16', { exact: true }).getByLabel('Subnet Address')).toContainText('10.6.0.0/16');
  await expect(page.getByLabel('10.7.0.0/16', { exact: true }).getByLabel('Subnet Address')).toContainText('10.7.0.0/16');
  await expect(page.getByLabel('10.8.0.0/13', { exact: true }).getByLabel('Subnet Address')).toContainText('10.8.0.0/13');
  await expect(page.getByLabel('10.16.0.0/13', { exact: true }).getByLabel('Subnet Address')).toContainText('10.16.0.0/13');
  await expect(page.getByLabel('10.6.0.0/16', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/16');
  await expect(page.getByLabel('10.7.0.0/16', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/16');
  await expect(page.getByLabel('10.4.0.0/14 Join')).toContainText('/14');
  await expect(page.getByLabel('10.0.0.0/11 Join')).toContainText('/11');
  await expect(page.getByLabel('10.0.0.0/10 Join')).toContainText('/10');
  await expect(page.getByLabel('10.0.0.0/9 Join')).toContainText('/9');
  await expect(page.getByLabel('/15 Join')).toContainText('/15');
  await expect(page.getByLabel('/13 Join')).toContainText('/13');
  await expect(page.getByLabel('/8 Join')).toContainText('/8');
});

test('#22 - Broken Order/Render From JSON Import', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Import / Export' }).click();
  await page.getByLabel('Import/Export Content').click();
  await page.getByLabel('Import/Export Content').fill('{\n  "config_version": "2",\n  "base_network": "10.0.0.0/8",\n  "subnets": {\n    "10.0.0.0/8": {\n      "10.128.0.0/9": {\n        "10.128.0.0/10": {\n          "10.128.0.0/11": {\n            "10.128.0.0/12": {\n              "10.128.0.0/13": {},\n              "10.136.0.0/13": {}\n            },\n            "10.144.0.0/12": {\n              "10.144.0.0/13": {},\n              "10.152.0.0/13": {}\n            }\n          },\n          "10.160.0.0/11": {\n            "10.160.0.0/12": {\n              "10.160.0.0/13": {},\n              "10.168.0.0/13": {}\n            },\n            "10.176.0.0/12": {\n              "10.176.0.0/13": {},\n              "10.184.0.0/13": {}\n            }\n          }\n        },\n        "10.192.0.0/10": {\n          "10.192.0.0/11": {\n            "10.192.0.0/12": {\n              "10.192.0.0/13": {},\n              "10.200.0.0/13": {}\n            },\n            "10.208.0.0/12": {\n              "10.208.0.0/13": {},\n              "10.216.0.0/13": {}\n            }\n          },\n          "10.224.0.0/11": {\n            "10.224.0.0/12": {\n              "10.224.0.0/13": {},\n              "10.232.0.0/13": {}\n            },\n            "10.240.0.0/12": {\n              "10.240.0.0/13": {},\n              "10.248.0.0/13": {}\n            }\n          }\n        }\n      },\n      "10.0.0.0/9": {\n        "10.0.0.0/10": {\n          "10.0.0.0/11": {\n            "10.0.0.0/12": {\n              "10.0.0.0/13": {\n                "10.0.0.0/14": {\n                  "10.0.0.0/15": {},\n                  "10.2.0.0/15": {}\n                },\n                "10.4.0.0/14": {\n                  "10.4.0.0/15": {},\n                  "10.6.0.0/15": {\n                    "10.6.0.0/16": {},\n                    "10.7.0.0/16": {}\n                  }\n                }\n              },\n              "10.8.0.0/13": {}\n            },\n            "10.16.0.0/12": {\n              "10.16.0.0/13": {},\n              "10.24.0.0/13": {}\n            }\n          },\n          "10.32.0.0/11": {\n            "10.32.0.0/12": {\n              "10.32.0.0/13": {},\n              "10.40.0.0/13": {}\n            },\n            "10.48.0.0/12": {\n              "10.48.0.0/13": {},\n              "10.56.0.0/13": {}\n            }\n          }\n        },\n        "10.64.0.0/10": {\n          "10.64.0.0/11": {\n            "10.64.0.0/12": {\n              "10.64.0.0/13": {},\n              "10.72.0.0/13": {}\n            },\n            "10.80.0.0/12": {\n              "10.80.0.0/13": {},\n              "10.88.0.0/13": {}\n            }\n          },\n          "10.96.0.0/11": {\n            "10.96.0.0/12": {\n              "10.96.0.0/13": {},\n              "10.104.0.0/13": {}\n            },\n            "10.112.0.0/12": {\n              "10.112.0.0/13": {},\n              "10.120.0.0/13": {}\n            }\n          }\n        }\n      }\n    }\n  }\n}');
  await page.getByRole('button', { name: 'Import' }).click();
  await expect(page.getByLabel('10.0.0.0/15', { exact: true }).getByLabel('Subnet Address')).toContainText('10.0.0.0/15');
  await expect(page.getByLabel('10.2.0.0/15', { exact: true }).getByLabel('Subnet Address')).toContainText('10.2.0.0/15');
  await expect(page.getByLabel('10.4.0.0/15', { exact: true }).getByLabel('Subnet Address')).toContainText('10.4.0.0/15');
  await expect(page.getByLabel('10.6.0.0/16', { exact: true }).getByLabel('Subnet Address')).toContainText('10.6.0.0/16');
  await expect(page.getByLabel('10.7.0.0/16', { exact: true }).getByLabel('Subnet Address')).toContainText('10.7.0.0/16');
  await expect(page.getByLabel('10.8.0.0/13', { exact: true }).getByLabel('Subnet Address')).toContainText('10.8.0.0/13');
  await expect(page.getByLabel('10.16.0.0/13', { exact: true }).getByLabel('Subnet Address')).toContainText('10.16.0.0/13');
  await expect(page.getByLabel('10.6.0.0/16', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/16');
  await expect(page.getByLabel('10.7.0.0/16', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/16');
  await expect(page.getByLabel('10.4.0.0/14 Join')).toContainText('/14');
  await expect(page.getByLabel('10.0.0.0/11 Join')).toContainText('/11');
  await expect(page.getByLabel('10.0.0.0/10 Join')).toContainText('/10');
  await expect(page.getByLabel('10.0.0.0/9 Join')).toContainText('/9');
  await expect(page.getByLabel('/15 Join')).toContainText('/15');
  await expect(page.getByLabel('/13 Join')).toContainText('/13');
  await expect(page.getByLabel('/8 Join')).toContainText('/8');
});






//test('Test', async ({ page }) => {
//  await page.goto('/');
//});


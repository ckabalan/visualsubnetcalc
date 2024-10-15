import { test, expect } from '@playwright/test';

async function getClipboardText(page) {
  return page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
}

test('Deep Functional Test', async ({ page }) => {
  // The goal of this test is to identify any weird interdependencies or issues that may arise
  //   from doing a variety of actions on one page load. It's meant to emulate a complex human
  //   user interaction often with steps that don't make sense.
  // This does a little of everything:
  //   - Manual Network Input
  //   - Subnet splitting/joining
  //   - Colors
  //   - Sharable URLs
  //   - AWS/Azure Mode
  //   - Import Reddit Example Config
  //   - Change Network Size
  await page.goto('https://127.0.0.1:8443/');
  // Change 10.0.0.0/8 -> 172.16.0.0/12
  await page.getByLabel('Network Address').click();
  await page.getByLabel('Network Address').press('Shift+Home');
  await page.getByLabel('Network Address').fill('172.16.0.0');
  await page.getByLabel('Network Size').fill('12');
  await page.getByRole('button', { name: 'Go' }).click();
  // Do a bunch of splitting
  await page.getByText('/12', { exact: true }).click();
  await page.getByLabel('172.24.0.0/13', { exact: true }).getByText('/13', { exact: true }).click();
  await page.getByLabel('172.24.0.0/14', { exact: true }).getByText('/14', { exact: true }).click();
  await page.getByLabel('172.26.0.0/15', { exact: true }).getByText('/15', { exact: true }).click();
  await page.getByLabel('172.26.0.0/16', { exact: true }).getByText('/16', { exact: true }).click();
  await page.getByRole('cell', { name: '/15 Split' }).click();
  await page.getByRole('cell', { name: '172.24.0.0/16 Split' }).click();
  await page.getByRole('cell', { name: '172.25.0.0/16 Split' }).click();
  await page.getByRole('cell', { name: '/14 Split' }).click();
  await page.getByRole('cell', { name: '172.30.0.0/15 Split' }).click();
  await page.getByRole('cell', { name: '172.31.0.0/16 Split' }).click();
  await page.getByLabel('172.31.128.0/17', { exact: true }).getByText('/17', { exact: true }).click();
  await page.getByLabel('172.31.192.0/18', { exact: true }).getByText('/18', { exact: true }).click();
  await page.getByLabel('172.31.224.0/19', { exact: true }).getByText('/19', { exact: true }).click();
  await page.getByLabel('172.31.192.0/19', { exact: true }).getByText('/19', { exact: true }).click();
  await page.getByRole('textbox', { name: '172.31.240.0/20 Note' }).click();
  await page.getByRole('textbox', { name: '172.31.240.0/20 Note' }).fill('Test A');
  await page.getByRole('textbox', { name: '172.31.224.0/20 Note' }).click();
  await page.getByRole('textbox', { name: '172.31.224.0/20 Note' }).fill('Test B');
  await page.getByRole('cell', { name: '172.31.240.0/20 Split' }).click();
  await page.getByRole('textbox', { name: '172.31.240.0/21 Note' }).click();
  await page.getByRole('textbox', { name: '172.31.240.0/21 Note' }).fill('Test A - 1');
  await page.getByRole('cell', { name: '172.31.248.0/21 Note' }).click();
  await page.getByRole('textbox', { name: '172.31.248.0/21 Note' }).fill('Test A - 2');
  await page.getByLabel('172.31.248.0/21', { exact: true }).getByText('/21', { exact: true }).click();
  await page.getByLabel('172.31.252.0/22', { exact: true }).getByText('/22', { exact: true }).click();
  await page.getByRole('cell', { name: '/21 Split' }).click();
  await page.getByRole('textbox', { name: '172.31.240.0/22 Note' }).click();
  await page.getByRole('textbox', { name: '172.31.240.0/22 Note' }).fill('Test A - 1A');
  await page.getByRole('textbox', { name: '172.31.244.0/22 Note' }).click();
  await page.getByRole('textbox', { name: '172.31.244.0/22 Note' }).fill('Test A - 1B');
  // Join a subnet
  await page.getByLabel('172.31.240.0/21 Join').click();
  // Change some colors and do some more splitting
  await page.getByText('Change Colors »').click();
  await page.getByLabel('Color 4').click();
  await page.getByRole('cell', { name: '172.26.128.0/17 Usable IPs' }).click();
  await page.getByText('« Stop Changing Colors').click();
  await page.getByRole('cell', { name: '172.26.128.0/17 Split' }).click();
  await page.getByRole('cell', { name: '172.26.192.0/18 Split' }).click();
  await page.getByText('Change Colors »').click();
  await page.getByLabel('Color 8').click();
  await page.getByRole('cell', { name: '172.26.128.0/18 Usable IPs' }).click();
  await page.getByText('« Stop Changing Colors').click();
  // Make sure we're still not changing colors
  await page.getByRole('cell', { name: '172.26.128.0/18 Split' }).click();
  // Check a bunch of specific items
  await expect(page.getByLabel('Network Address')).toHaveValue('172.16.0.0');
  await expect(page.getByLabel('Network Size')).toHaveValue('12');
  await expect(page.getByRole('textbox', { name: '172.31.254.0/23 Note' })).toHaveValue('Test A - 2');
  await expect(page.getByRole('textbox', { name: '172.31.252.0/23 Note' })).toHaveValue('Test A - 2');
  await expect(page.getByRole('textbox', { name: '/22 Note' })).toHaveValue('Test A - 2');
  await expect(page.getByRole('textbox', { name: '/21 Note' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: '172.31.224.0/20 Note' })).toHaveValue('Test B');
  await expect(page.getByLabel('172.16.0.0/13', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/13');
  await expect(page.getByLabel('172.24.0.0/17', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/17');
  await expect(page.getByLabel('172.26.128.0/19', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/19');
  await expect(page.getByLabel('172.27.0.0/16', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/16');
  await expect(page.getByLabel('172.28.0.0/15', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/15');
  await expect(page.getByLabel('172.30.0.0/16', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/16');
  await expect(page.getByLabel('172.31.0.0/17', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/17');
  await expect(page.getByLabel('172.31.128.0/18', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/18');
  await expect(page.getByLabel('172.31.192.0/20', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/20');
  await expect(page.getByLabel('172.31.240.0/21', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/21');
  await expect(page.getByLabel('172.31.248.0/22', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/22');
  await expect(page.getByLabel('172.31.252.0/23', { exact: true }).getByLabel('Split', { exact: true })).toContainText('/23');
  await expect(page.getByLabel('/12 Join')).toContainText('/12');
  await expect(page.getByLabel('/13 Join')).toContainText('/13');
  await expect(page.getByLabel('172.26.128.0/17 Join')).toContainText('/17');
  await expect(page.getByLabel('172.31.128.0/17 Join')).toContainText('/17');
  await expect(page.getByLabel('172.31.192.0/19 Join')).toContainText('/19');
  await expect(page.getByLabel('172.31.224.0/19 Join')).toContainText('/19');
  await expect(page.getByLabel('/21 Join')).toContainText('/21');
  await expect(page.getByLabel('/22 Join')).toContainText('/22');
  await expect(page.getByRole('row', { name: '172.26.128.0/19' })).toHaveCSS('background-color', 'rgb(255, 198, 255)');
  await expect(page.getByRole('row', { name: '172.26.160.0/19' })).toHaveCSS('background-color', 'rgb(255, 198, 255)');
  await expect(page.getByRole('row', { name: '172.26.192.0/19' })).toHaveCSS('background-color', 'rgb(202, 255, 191)');
  await expect(page.getByRole('row', { name: '172.26.224.0/19' })).toHaveCSS('background-color', 'rgb(202, 255, 191)');
  // Check the Shareable URL
  await page.getByText('Copy Shareable URL').click();
  let clipboardUrl = await getClipboardText(page);
  expect(clipboardUrl).toContain('/index.html?c=1N4IgbiBcIEwgNCARlEBGA7DAdGgbNgAxED0aciAzlKIQMY0iEAmNAvomq5KDAKaMALADNGADgDmjfAAt2nDHJ5sOIAJxSe6MUuCq0a3StUBWUVrSFNvQkcQw0ukIJgBLcYIBWjBtADEwsJ0eIEgqmIm3lq+IAFBIaIqiIIAzO5aYnhRoDF+dACGgUiJiGIY2SC5BUWJxpxo1nUgKQJaIfIgGOagaIKNnCbWzbYdKY6MeG4deGnSMFmMMCYwANYdSylryvow5YsmglugAHaoACp8lAAuAAQAQmH2JiZHICaWADaMp9AIlaiPN5oNBfCyEGAwAC233Ol1uAEEbgBaG5wfTglLQrQwQiCPA-E6w643REotH2XEYAkgH4gC7E0mosLGFmsthAA');
  // Check the Export
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Import / Export' }).click();
  await expect(page.getByLabel('Import/Export Content')).toHaveValue('{\n  "config_version": "2",\n  "base_network": "172.16.0.0/12",\n  "subnets": {\n    "172.16.0.0/12": {\n      "172.16.0.0/13": {},\n      "172.24.0.0/13": {\n        "172.24.0.0/14": {\n          "172.24.0.0/15": {\n            "172.24.0.0/16": {\n              "172.24.0.0/17": {},\n              "172.24.128.0/17": {}\n            },\n            "172.25.0.0/16": {\n              "172.25.0.0/17": {},\n              "172.25.128.0/17": {}\n            }\n          },\n          "172.26.0.0/15": {\n            "172.26.0.0/16": {\n              "172.26.0.0/17": {},\n              "172.26.128.0/17": {\n                "172.26.128.0/18": {\n                  "172.26.128.0/19": {\n                    "_color": "#ffc6ff"\n                  },\n                  "172.26.160.0/19": {\n                    "_color": "#ffc6ff"\n                  }\n                },\n                "172.26.192.0/18": {\n                  "172.26.192.0/19": {\n                    "_color": "#caffbf"\n                  },\n                  "172.26.224.0/19": {\n                    "_color": "#caffbf"\n                  }\n                }\n              }\n            },\n            "172.27.0.0/16": {}\n          }\n        },\n        "172.28.0.0/14": {\n          "172.28.0.0/15": {},\n          "172.30.0.0/15": {\n            "172.30.0.0/16": {},\n            "172.31.0.0/16": {\n              "172.31.0.0/17": {},\n              "172.31.128.0/17": {\n                "172.31.128.0/18": {},\n                "172.31.192.0/18": {\n                  "172.31.192.0/19": {\n                    "172.31.192.0/20": {},\n                    "172.31.208.0/20": {}\n                  },\n                  "172.31.224.0/19": {\n                    "172.31.224.0/20": {\n                      "_note": "Test B"\n                    },\n                    "172.31.240.0/20": {\n                      "172.31.240.0/21": {\n                        "_note": "",\n                        "_color": ""\n                      },\n                      "172.31.248.0/21": {\n                        "172.31.248.0/22": {\n                          "_note": "Test A - 2"\n                        },\n                        "172.31.252.0/22": {\n                          "172.31.252.0/23": {\n                            "_note": "Test A - 2"\n                          },\n                          "172.31.254.0/23": {\n                            "_note": "Test A - 2"\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}');
  await page.getByLabel('Import/Export', { exact: true }).getByText('Close').click();
  // Set to AWS Mode
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - AWS' }).click();
  // Check AWS Mode Settings
  await expect(page.getByLabel('172.31.254.0/23', { exact: true }).getByLabel('Usable IPs (AWS)')).toContainText('172.31.254.4 - 172.31.255.254');
  await expect(page.getByLabel('172.31.254.0/23', { exact: true }).getByLabel('Hosts')).toContainText('507');
  await page.getByText('Copy Shareable URL').click();
  clipboardUrl = await getClipboardText(page);
  expect(clipboardUrl).toContain('/index.html?c=1N4IgbiBcIEwgNCARlEBGA7DAdGgbNgAxED0aciAtqgIIDqAygiAM5SiEDG7IhAJuwC+iNAMigYAUx4AWAGY8AHAHMe+ABZCRGTeMHCQATlXj0i3cANpDF-QYCsC02kImJhW4hhoLIGTABLJRkAKx5uaABiOTlOPBiQA0V7MNMIkGjY+IV9RBkAZiDTRTxU0HTIzgBDGKQcxEUMMpAK6tqcuxE0N06QfOlTeK0QDCdQNBkekXs3Po9h-J8ePEDhvEK1GFKeGHsYAGth3fzDvSsYJp37GVPQADtUABVJFgAXAAIAIUSve3tbkD2FwAGx4D2gzHSP0BaDQoOchBgMGopnBIGeb3eNHeAFp3nArIj8ij3DI8OD7k8Xh9sXiCV5CDIMBSQGiMTTcfjEnYebzBEA');
  // Set to Azure Mode
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Mode - Azure' }).click();
  // Check Azure Mode Settings
  await expect(page.getByLabel('172.31.254.0/23', { exact: true }).getByLabel('Usable IPs (Azure)')).toContainText('172.31.254.4 - 172.31.255.254');
  await expect(page.getByLabel('172.31.254.0/23', { exact: true }).getByLabel('Hosts')).toContainText('507');
  await page.getByText('Copy Shareable URL').click();
  clipboardUrl = await getClipboardText(page);
  expect(clipboardUrl).toContain('/index.html?c=1N4IgbiBcIEwgNCARlEBGA7DAdGgbNgAxED0aciAtqgIIBaAqgEoCiCIAzlKIQMbchCAE24BfRGhGRQMAKYCALADMBADgDmA-AAsxEjLumjxIAJybp6VYeAm0pm8ZMBWFZbSELMwo8Qw0NiAKMACWagoAVgL80ADESkq8eAkgJqrOUZYxIPGJySrGiAoAzGGWqniZoNmxvACGCUgFiKoYVSA19Y0FThJoXr0gxfKWyXogGG6gaAoDEs5eQz7jxQECeKHjeKVaMJUCMM4wANbjh8WnRnYwbQfOCpegAHaoACqyHAAuAAQAQql+ZzOR4gZweAA2Ahe0HY2QBoLQaEh7kIMBg1Es0JA7y+3xo3wAtN84HZUcUMd4FHhoc83h8fviiSS-IQFBgaSAsTiGYTiaknALBaIgA');
  // Import Default Reddit Config
  await page.getByRole('button', { name: 'Tools' }).click();
  await page.getByRole('link', { name: 'Import / Export' }).click();
  await page.getByLabel('Import/Export Content').click();
  await page.getByLabel('Import/Export Content').press('ControlOrMeta+a');
  await page.getByLabel('Import/Export Content').fill('{\n  "config_version": "2",\n  "base_network": "10.0.0.0/20",\n  "subnets": {\n    "10.0.0.0/20": {\n      "10.0.0.0/21": {\n        "10.0.0.0/22": {\n          "10.0.0.0/23": {\n            "10.0.0.0/24": {\n              "_note": "Data Center - Virtual Servers",\n              "_color": "#9bf6ff"\n            },\n            "10.0.1.0/24": {\n              "_note": "Data Center - Virtual Servers",\n              "_color": "#9bf6ff"\n            }\n          },\n          "10.0.2.0/23": {\n            "10.0.2.0/24": {\n              "_note": "Data Center - Virtual Servers",\n              "_color": "#9bf6ff"\n            },\n            "10.0.3.0/24": {\n              "_note": "Data Center - Physical Servers",\n              "_color": "#a0c4ff"\n            }\n          }\n        },\n        "10.0.4.0/22": {\n          "10.0.4.0/23": {\n            "_note": "Building A - Wifi",\n            "_color": "#ffd6a5"\n          },\n          "10.0.6.0/23": {\n            "_note": "Building A - LAN",\n            "_color": "#ffd6a5"\n          }\n        }\n      },\n      "10.0.8.0/21": {\n        "10.0.8.0/22": {\n          "10.0.8.0/23": {\n            "10.0.8.0/24": {\n              "_note": "Building A - Printers",\n              "_color": "#ffd6a5"\n            },\n            "10.0.9.0/24": {\n              "_note": "Building A - Voice",\n              "_color": "#ffd6a5"\n            }\n          },\n          "10.0.10.0/23": {\n            "_note": "Building B - Wifi",\n            "_color": "#fdffb6"\n          }\n        },\n        "10.0.12.0/22": {\n          "10.0.12.0/23": {\n            "_note": "Building B - LAN",\n            "_color": "#fdffb6"\n          },\n          "10.0.14.0/23": {\n            "10.0.14.0/24": {\n              "_note": "Building B - Printers",\n              "_color": "#fdffb6"\n            },\n            "10.0.15.0/24": {\n              "_note": "Building B - Voice",\n              "_color": "#fdffb6"\n            }\n          }\n        }\n      }\n    }\n  }\n}');
  await page.getByRole('button', { name: 'Import' }).click();
  // Do all the Reddit Default Checks
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
  // Now change the whole network address
  await page.getByLabel('Network Address').click();
  await page.getByLabel('Network Address').press('ControlOrMeta+a');
  await page.getByLabel('Network Address').fill('192.168.0.0');
  await page.getByRole('button', { name: 'Go' }).click();
  await expect(page.getByLabel('192.168.0.0/24', { exact: true }).getByLabel('Subnet Address')).toContainText('192.168.0.0/24');
});



//test('Test', async ({ page }) => {
//  await page.goto('https://127.0.0.1:8443/');
//});

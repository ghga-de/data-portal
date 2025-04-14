/**
 * Playwright test for dataset browsing.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { expect, test } from '@playwright/test';

test('can browse data', async ({ page }) => {
  await page.goto('/');

  const browseDataLink = page.getByText('Browse Data').first();
  await expect(browseDataLink).toBeVisible();
  await browseDataLink.click();

  await expect(page).toHaveURL('/browse');

  const main = page.locator('main');
  await expect(main).toContainText('Total Datasets:25');
  await expect(main).toContainText('GHGAD123456789012347');
  await expect(main).toContainText('Test dataset for details');
});

test('can view a dataset summary', async ({ page }) => {
  await page.goto('/browse');

  const main = page.locator('main');
  await expect(main).toContainText('Total Datasets:25');

  await expect(main).toContainText('GHGAD123456789012347');
  await expect(main).toContainText('Test dataset for details');

  // description and dataset summary are not yet visible
  await expect(main).not.toContainText('This is the test dataset description');
  await expect(main).not.toContainText('14 Experiments');

  const openSummary = page.getByRole('button', { name: 'GHGAD123456789012347' });
  await expect(openSummary).toBeVisible();
  await openSummary.click();

  // now the description and summary should be visible
  await expect(main).toContainText('This is the test dataset description');
  await expect(main).toContainText('14 Experiments');
});

test('can navigate to dataset details', async ({ page }) => {
  await page.goto('/browse');
  const main = page.locator('main');

  await main.getByText('GHGAD123456789012347').click();

  await expect(page).toHaveURL('/browse');

  const button = page.getByLabel('GHGAD123456789012347').getByText('Dataset Details');
  await expect(button).toBeVisible();
  await button.click();

  await expect(page).toHaveURL('/dataset/GHGAD123456789012347');

  await expect(page).toHaveTitle('Dataset GHGAD123456789012347 | GHGA Data Portal');

  await expect(main).toContainText('Dataset ID | GHGAD123456789012347');
  await expect(main).toContainText('Test dataset with some details for testing.');

  await expect(main).toContainText('Test study description.');
  await expect(main).toContainText('Files Summary (12 files, 6.16 GB in total)');

  // files table should not yet be visible
  await expect(main).not.toContainText('File ID');
  await expect(main).not.toContainText('GHGAF956121333');
  await expect(main).not.toContainText('Research data file 3');
  await expect(main).not.toContainText('Tübingen 3');

  const openFile = main.getByRole('button', { name: 'Files Summary' });
  await expect(openFile).toBeVisible();
  await openFile.click();

  // files table should now be visible
  await expect(main).toContainText('File ID');
  await expect(main).toContainText('GHGAF956121333');
  await expect(main).toContainText('Research data file 3');
  await expect(main).toContainText('Tübingen 3');

  // last file should bot yet be visible
  await expect(main).not.toContainText('EGAF956121335');
  await expect(main).not.toContainText('Research data file 5');

  const nextPageButton = main.getByRole('button', { name: 'Next page' });
  await expect(nextPageButton).toBeVisible();
  await nextPageButton.click();

  // last file should now be visible
  await expect(main).toContainText('EGAF956121335');
  await expect(main).toContainText('Research data file 5');
});

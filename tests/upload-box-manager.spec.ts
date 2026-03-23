/**
 * Playwright test for Upload Box manager.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { expect, test } from './fixtures';

test('does not show Upload Box manager when not logged in', async ({ page }) => {
  const logIn = page.getByRole('button', { name: 'Log In' });
  await expect(logIn).toHaveCount(0);

  const adminMenu = page.getByRole('navigation').getByLabel('Administration');
  await expect(adminMenu).toHaveCount(0);

  await page.goto('/upload-box-manager');
  await expect(page).toHaveTitle('Home | GHGA Data Portal');

  const main = page.locator('main');
  await expect(main).not.toContainText('Upload Box Manager');
});

test('can use Upload Box manager when logged in', async ({
  uploadBoxManagerPage: page,
}) => {
  await expect(page).toHaveTitle('Upload Box Manager | GHGA Data Portal');
  await expect(page).toHaveURL('/upload-box-manager');

  const main = page.locator('main');
  const heading = main.getByRole('heading', { level: 1 });
  await expect(heading).toHaveText('Upload Box Manager');
});

test('can navigate to Upload Box details', async ({ uploadBoxManagerPage: page }) => {
  const detailsPageMain = page.locator('main');
  const detailsButton = detailsPageMain
    .getByRole('button', { name: 'View upload box details' })
    .first();
  await expect(detailsButton).toBeVisible();
  await detailsButton.click();
  await expect(page).toHaveURL(/\/upload-box-manager\/.+/);
  await expect(page).toHaveTitle('Upload Box Details | GHGA Data Portal');

  const uploadBoxInfo = page.getByRole('heading', {
    level: 2,
    name: 'Upload Box Info',
  });
  await expect(uploadBoxInfo).toBeVisible();
  await expect(detailsPageMain).toContainText('Title:');
  await expect(detailsPageMain).toContainText('State:');
  await expect(detailsPageMain).toContainText('Description:');
  await expect(detailsPageMain).toContainText('Last change:');
  await expect(detailsPageMain).toContainText('Files / Size:');

  const uploadsGrantsCard = page.getByRole('heading', {
    level: 2,
    name: 'Upload Grants',
  });
  await expect(uploadsGrantsCard).toBeVisible();
  const storageCard = page.getByRole('heading', { level: 2, name: /Storage.*Files/ });
  await expect(storageCard).toBeVisible();

  const backButton = page.getByRole('button', {
    name: 'Go back to previous page',
  });
  await expect(backButton).toBeVisible();
  await backButton.click();
  await expect(page).toHaveURL('/upload-box-manager');
});

test('can navigate to Add Grant page', async ({ uploadBoxManagerPage: page }) => {
  const detailsButton = page
    .locator('main')
    .getByRole('button', { name: 'View upload box details' })
    .first();
  await detailsButton.click();
  await expect(page).toHaveURL(/\/upload-box-manager\/.+/);
  await expect(page).toHaveTitle('Upload Box Details | GHGA Data Portal');

  const addGrantButton = page.getByRole('button', { name: /Add.*grant/i });
  await expect(addGrantButton).toBeVisible();
  await addGrantButton.click();
  await expect(page).toHaveURL(/\/upload-box-manager\/.+\/grant\/new/);
  await expect(page).toHaveTitle('New Upload Grant | GHGA Data Portal');

  const backButton = page.getByRole('button', {
    name: 'Go back to upload box details',
  });
  await expect(backButton).toBeVisible();
  await backButton.click();
  await expect(page).toHaveURL(/\/upload-box-manager\/.+/);
});

test('displays error message when upload box not found', async ({
  uploadBoxManagerPage: page,
}) => {
  const invalidId = `box-does-not-exist-${Date.now()}`;
  await page.goto(`/upload-box-manager/${invalidId}`);

  const main = page.locator('main');
  await expect(main).toContainText('Upload box not found.');

  const backButton = page.getByRole('button', { name: 'Go back to previous page' });
  await expect(backButton).toBeVisible();
  await backButton.click();
  await expect(page).toHaveURL('/upload-box-manager');
});

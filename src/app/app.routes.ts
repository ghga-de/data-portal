/**
 * The main app routes
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { canDeactivate as canDeactivateAuth } from './auth/features/can-deactivate.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./portal/features/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
    title: 'Home',
  },
  {
    path: 'browse',
    loadComponent: () =>
      import('./metadata/features/metadata-browser/metadata-browser.component').then(
        (m) => m.MetadataBrowserComponent,
      ),
    title: 'Browse Datasets',
  },
  {
    path: 'browse/:id',
    loadComponent: () =>
      import(
        './metadata/features/dataset-details-page/dataset-details-page.component'
      ).then((m) => m.DatasetDetailsPageComponent),
    title: 'Dataset Details',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./portal/features/account/account.component').then(
        (m) => m.AccountComponent,
      ),
    title: 'User Profile',
  },
  // routes used in the authentication flows
  {
    path: 'oauth/callback',
    canActivate: [() => inject(AuthService).guardCallback()],
    children: [],
  },
  {
    path: 'register',
    canActivate: [() => inject(AuthService).guardRegister()],
    canDeactivate: [canDeactivateAuth],
    loadComponent: () =>
      import('./auth/features/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    title: 'Registration',
  },
  {
    path: 'setup-totp',
    canActivate: [() => inject(AuthService).guardSetupTotp()],
    canDeactivate: [canDeactivateAuth],
    loadComponent: () =>
      import('./auth/features/setup-totp/setup-totp.component').then(
        (m) => m.SetupTotpComponent,
      ),
    title: 'Set up TOTP',
  },
  {
    path: 'confirm-totp',
    canActivate: [() => inject(AuthService).guardConfirmTotp()],
    canDeactivate: [canDeactivateAuth],
    loadComponent: () =>
      import('./auth/features/confirm-totp/confirm-totp.component').then(
        (m) => m.ConfirmTotpComponent,
      ),
    title: 'Confirm TOTP',
  },
  {
    path: '**',
    loadComponent: () =>
      import('../app/portal/features/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent,
      ),
    title: 'Page not found',
  },
];

/**
 * This strategy provides a simpler way to set the page title. The routes (above) still set a title but it uses a template syntax to extend the title by the GHGA Data Portal string.
 */
@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  TITLE_TEMPLATE = '#title | GHGA Data Portal';

  /**
   * Constructor for the strategy.
   * @param title Creates the member called title that stores the current page title.
   */
  constructor(private readonly title: Title) {
    super();
  }
  /**
   * This gets called whenever the router requests a new title for a site.
   * @param routerState passes the current route to the function.
   */
  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(this.TITLE_TEMPLATE.replace('#title', title));
    }
  }
}

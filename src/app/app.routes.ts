/**
 * The main app routes
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';

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
  // routes used in the authentication flows
  {
    path: 'oauth/callback',
    canActivate: [() => inject(AuthService).oidcRedirect()],
    children: [],
  },
  // TODO: add guards to the following routes that check the expected state
  // TODO: also add deactivation guards to these routes
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/features/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    title: 'Registration',
  },
  {
    path: 'setup-totp',
    loadComponent: () =>
      import('./auth/features/setup-totp/setup-totp.component').then(
        (m) => m.SetupTotpComponent,
      ),
    title: 'Set up TOTP',
  },
  {
    path: 'confirm-totp',
    loadComponent: () =>
      import('./auth/features/confirm-totp/confirm-totp.component').then(
        (m) => m.ConfirmTotpComponent,
      ),
    title: 'Confirm TOTP',
  },
];

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
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
      this.title.setTitle(`${title} | GHGA Data Portal`);
    }
  }
}

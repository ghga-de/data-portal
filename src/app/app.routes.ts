/**
 * The main app routes
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { canDeactivate as canDeactivateAuth } from './auth/features/can-deactivate.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./portal/features/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: 'browse',
    loadComponent: () =>
      import('./metadata/features/metadata-browser/metadata-browser.component').then(
        (m) => m.MetadataBrowserComponent,
      ),
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
  },
  {
    path: 'setup-totp',
    canActivate: [() => inject(AuthService).guardSetupTotp()],
    canDeactivate: [canDeactivateAuth],
    loadComponent: () =>
      import('./auth/features/setup-totp/setup-totp.component').then(
        (m) => m.SetupTotpComponent,
      ),
  },
  {
    path: 'confirm-totp',
    canActivate: [() => inject(AuthService).guardConfirmTotp()],
    canDeactivate: [canDeactivateAuth],
    loadComponent: () =>
      import('./auth/features/confirm-totp/confirm-totp.component').then(
        (m) => m.ConfirmTotpComponent,
      ),
  },
];

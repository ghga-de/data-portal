/* eslint-disable jsdoc/require-jsdoc */
import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';

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
  {
    path: 'oauth/callback',
    canActivate: [() => inject(AuthService).oidcRedirect()],
    children: [],
  },
];

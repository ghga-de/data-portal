import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    /**
     * Lazy-loading home page component
     * @returns Lazy-loaded home page component
     */
    loadComponent: () =>
      import('./portal/features/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: 'browse',
    /**
     * Lazy-loading metadata browser component
     * @returns Lazy-loaded metadata browser component
     */
    loadComponent: () =>
      import('./metadata/features/metadata-browser/metadata-browser.component').then(
        (m) => m.MetadataBrowserComponent,
      ),
  },
];

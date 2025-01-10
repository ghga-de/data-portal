/**
 * The main app configuration
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';

import {
  HTTP_INTERCEPTORS,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CsrfInterceptor } from '@app/auth/services/csrf.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([withHttpCacheInterceptor()]),
    ),
    // cache all GET requests by default
    provideHttpCache({ strategy: 'implicit' }),
    provideNoopAnimations(),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
  ],
};

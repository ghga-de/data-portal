/**
 * The main app configuration
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  Router,
  TitleStrategy,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';

import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { withFetch } from '@angular/common/http';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { csrfInterceptor } from '@app/auth/services/csrf.service';
import { routes, TemplatePageTitleStrategy } from './app.routes';

import {
  DEFAULT_DATE_FORMATS,
  DEFAULT_DATE_LOCALE,
  DEFAULT_DATE_OUTPUT_FORMAT,
} from '@app/shared/utils/date-formats';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions({
        onViewTransitionCreated: ({ transition }) => {
          // Get the current navigation object
          const router = inject(Router);
          const nav = router.getCurrentNavigation();
          if (!nav) {
            return;
          }

          // Get the previous URL (navigating from) and the current one (navigating to)
          const fromUrl = nav.previousNavigation?.finalUrl?.toString() ?? '';
          const toUrl = nav.finalUrl?.toString() ?? '';

          if (!fromUrl || !toUrl) {
            return;
          }

          // Check if we are navigating from/to the user details/manager
          const fromManager = /\/user-manager\/?$/.test(fromUrl);
          const toDetails = /\/user-manager\/.+$/.test(toUrl);
          const fromDetails = /\/user-manager\/.+$/.test(fromUrl);
          const toManager = /\/user-manager\/?$/.test(toUrl);

          // Setup the <style> element we will use to specify the transition
          const styleElementId = 'user-manager-view-transition';
          let styleElement = document.getElementById(
            styleElementId,
          ) as HTMLStyleElement | null;
          if (styleElement) {
            // If the style element is already present, remove it to prevent conflicts
            styleElement.remove();
          }

          // Define the CSS of the transition animation based on which direction we are going
          const css = `
          ::view-transition-old(root) {
          animation: slide-out-to-${fromManager && toDetails ? 'left' : 'right'} 0.6s ease 0s 1 normal forwards;
        }

        ::view-transition-new(root) {
          animation: slide-in-from-${fromManager && toDetails ? 'right' : 'left'} 0.6s ease 0s 1 normal forwards;
        }
          `;

          // Add the style element to the <head> to allow for the transition to show
          if ((fromManager && toDetails) || (fromDetails && toManager)) {
            styleElement = document.createElement('style');
            styleElement.id = styleElementId;
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
          } else {
            // Skip transitions for all other routes/pages
            transition.skipTransition();
          }
        },
      }),
    ),
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    provideHttpClient(
      withFetch(),
      withInterceptors([withHttpCacheInterceptor(), csrfInterceptor]),
    ),
    // cache all GET requests by default
    provideHttpCache({ strategy: 'implicit' }),
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: DEFAULT_DATE_LOCALE },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: DEFAULT_DATE_OUTPUT_FORMAT },
    },
    provideDateFnsAdapter(DEFAULT_DATE_FORMATS),
  ],
};

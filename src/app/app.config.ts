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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
} from '@angular/router';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';

import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { withFetch } from '@angular/common/http';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { csrfInterceptor } from '@app/auth/services/csrf.service';
import { enGB } from 'date-fns/locale';
import { routes, TemplatePageTitleStrategy } from './app.routes';

const DEFAULT_INPUT_DATE_FORMAT = 'yyyy-MM-dd';
const DEFAULT_OUTPUT_DATE_FORMAT = 'yyyy-MM-dd';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    provideHttpClient(
      withFetch(),
      withInterceptors([withHttpCacheInterceptor(), csrfInterceptor]),
    ),
    // cache all GET requests by default
    provideHttpCache({ strategy: 'implicit' }),
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: enGB },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: DEFAULT_OUTPUT_DATE_FORMAT },
    },
    provideDateFnsAdapter({
      parse: {
        dateInput: [
          DEFAULT_INPUT_DATE_FORMAT,
          'yyyy-MM-dd',
          'dd.MM.yyyy',
          'dd/MM/yyyy',
          'd.M.yyyy',
          'd/M/yyyy',
          'dd.M.yyyy',
          'dd/M/yyyy',
          'd.MM.yyyy',
          'd/MM/yyyy',
        ],
      },
      display: {
        dateInput: DEFAULT_INPUT_DATE_FORMAT,
        monthYearLabel: 'MMM yyyy',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM yyyy',
      },
    }),
  ],
};

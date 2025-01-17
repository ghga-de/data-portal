/**
 * Global summary service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource, Signal } from '@angular/core';
import {
  BaseGlobalSummary,
  emptyGlobalSummary,
  GlobalSummary,
} from '@app/metadata/models/global-summary';
import { ConfigService } from '@app/shared/services/config.service';
import { firstValueFrom, map } from 'rxjs';

/**
 * Global summary service
 *
 * This service provides the functionality to fetch the global metadata summary stats from the server.
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalSummaryService {
  #http = inject(HttpClient);

  #config = inject(ConfigService);
  #metldataURL = this.#config.metldataURL;

  #globalSummaryUrl = `${this.#metldataURL}/stats`;

  #globalSummary = resource<GlobalSummary, void>({
    loader: () =>
      firstValueFrom(
        this.#http
          .get<BaseGlobalSummary>(this.#globalSummaryUrl)
          .pipe(map((value) => value.resource_stats)),
      ),
  }).asReadonly();

  /**
   * The global summary (empty while loading) as a signal
   */
  globalSummary: Signal<GlobalSummary> = computed(
    () => this.#globalSummary.value() ?? emptyGlobalSummary,
  );

  /**
   * The global summary error as a signal
   */
  globalSummaryError: Signal<unknown> = this.#globalSummary.error;
}

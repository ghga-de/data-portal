/**
 * Global summary service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource, signal, Signal } from '@angular/core';
import {
  BaseGlobalSummary,
  emptyGlobalSummary,
  GlobalSummary,
} from '@app/metadata/models/global-summary';
import { ConfigService } from '@app/shared/services/config.service';
import { firstValueFrom, map } from 'rxjs';
import { DatasetSummary, emptyDatasetSummary } from '../models/dataset-summary';

/**
 * Metldata Query service
 *
 * This service provides the functionality to fetch the global metadata summary stats from the server.
 */
@Injectable({
  providedIn: 'root',
})
export class MetldataQueryService {
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

  #id_ = signal<string | undefined>(undefined);

  #datasetSummary = resource({
    request: computed(() => ({
      id_: this.#id_(),
    })),
    loader: (param) => {
      const id_ = param.request.id_;

      const datasetSummaryURL = `${this.#metldataURL}/artifacts/stats_public/classes/DatasetStats/resources/${id_}`;
      if (id_) {
        return Promise.resolve(
          firstValueFrom(this.#http.get<DatasetSummary>(datasetSummaryURL)),
        );
      } else {
        return Promise.resolve(emptyDatasetSummary);
      }
    },
  });

  /**
   * Function to set some data into the local private variables
   * @param id_ Dataset ID
   */
  loadDatasetID(id_: string): void {
    this.#id_.set(id_);
  }

  /**
   * The dataset summary (empty while loading) as a signal
   */
  datasetSummary: Signal<DatasetSummary> = computed(
    () => this.#datasetSummary.value() ?? emptyDatasetSummary,
  );

  /**
   * The dataset summary error as a signal
   */
  datasetSummaryError: Signal<unknown> = this.#datasetSummary.error;
}

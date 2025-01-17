/**
 * Short module description
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource, signal, Signal } from '@angular/core';
import { ConfigService } from '@app/shared/services/config.service';
import { firstValueFrom } from 'rxjs';
import { DatasetSummary, emptyDatasetSummary } from '../models/dataset-summary';

/**
 * Dataset summary service
 *
 * This service provides the functionality to fetch dataset summary data from the server.
 */
@Injectable({
  providedIn: 'root',
})
export class DatasetSummaryService {
  #http = inject(HttpClient);

  #config = inject(ConfigService);
  #metlDataUrl = this.#config.metldataURL;
  #id_ = signal<string | undefined>(undefined);

  #datasetSummary = resource({
    request: computed(() => ({
      id_: this.#id_(),
    })),
    loader: (param) => {
      const id_ = param.request.id_;
      if (id_) {
        return Promise.resolve(
          firstValueFrom(
            this.#http.get<DatasetSummary>(
              `${this.#metlDataUrl}/artifacts/stats_public/classes/DatasetStats/resources/${id_}`,
            ),
          ),
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
  load(id_: string): void {
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

/**
 * Global summary service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource, signal, Signal } from '@angular/core';
import { ConfigService } from '@app/shared/services/config.service';
import { firstValueFrom } from 'rxjs';
import { DatasetDetails, emptyDatasetDetails } from '../models/dataset-details';
import { DatasetSummary, emptyDatasetSummary } from '../models/dataset-summary';

/**
 * Metadata Query service
 *
 * This service provides the functionality to fetch dataset summaries and details from the server.
 */
@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  #http = inject(HttpClient);

  #config = inject(ConfigService);
  #metldataUrl = this.#config.metldataUrl;

  #datasetSummaryUrl = `${this.#metldataUrl}/artifacts/stats_public/classes/DatasetStats/resources`;
  #datasetDetailsUrl = `${this.#metldataUrl}/artifacts/embedded_public/classes/EmbeddedDataset/resources`;

  #summaryID = signal<string | undefined>(undefined);
  #detailsID = signal<string | undefined>(undefined);

  #datasetSummary = resource({
    request: computed(() => ({
      id_: this.#summaryID(),
    })),
    loader: (param) => {
      const id_ = param.request.id_;

      if (id_) {
        return Promise.resolve(
          firstValueFrom(
            this.#http.get<DatasetSummary>(`${this.#datasetSummaryUrl}/${id_}`),
          ),
        );
      } else {
        return Promise.resolve(emptyDatasetSummary);
      }
    },
  });

  /**
   * The dataset summary (empty while loading) as a signal
   */
  datasetSummary: Signal<DatasetSummary> = computed(
    () => this.#datasetSummary.value() ?? emptyDatasetSummary,
  );

  /**
   * Whether the dataset summary is loading as a signal
   */
  datasetSummaryIsLoading: Signal<boolean> = this.#datasetSummary.isLoading;

  /**
   * The dataset summary error as a signal
   */
  datasetSummaryError: Signal<unknown> = this.#datasetSummary.error;

  /**
   * Load the dataset with the given ID for the dataset summary call
   * @param id Dataset ID
   */
  loadDatasetSummaryID(id: string): void {
    this.#summaryID.set(id);
  }

  #datasetDetails = resource({
    request: computed(() => ({
      id_: this.#detailsID(),
    })),
    loader: (param) => {
      const id_ = param.request.id_;

      if (id_) {
        return Promise.resolve(
          firstValueFrom(
            this.#http.get<DatasetDetails>(`${this.#datasetDetailsUrl}/${id_}`),
          ),
        );
      } else {
        return Promise.resolve(emptyDatasetDetails);
      }
    },
  });

  /**
   * Load the dataset with the given ID for the dataset details call
   * @param id Dataset ID
   */
  loadDatasetDetailsID(id: string): void {
    this.#detailsID.set(id);
  }

  /**
   * The dataset details (empty while loading) as a signal
   */
  datasetDetails: Signal<DatasetDetails> = computed(
    () => this.#datasetDetails.value() ?? emptyDatasetDetails,
  );

  /**
   * Whether the dataset details are loading as a signal
   */
  datasetDetailsIsLoading: Signal<boolean> = this.#datasetDetails.isLoading;

  /**
   * The dataset details error as a signal
   */
  datasetDetailsError: Signal<unknown> = this.#datasetDetails.error;
}

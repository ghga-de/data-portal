/**
 * Short module description
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource, Signal, signal } from '@angular/core';
import { ConfigService } from '@app/shared/services/config.service';
import { firstValueFrom } from 'rxjs';
import {
  DatasetInformation,
  emptyDatasetInformation,
} from '../models/dataset-information';

/**
 * Dataset Information query service
 *
 * This service provides the functionality to fetch aggregated information on datasets.
 */
@Injectable({
  providedIn: 'root',
})
export class DatasetInformationService {
  #http = inject(HttpClient);

  #config = inject(ConfigService);
  #dinsUrl = this.#config.dinsUrl;

  #datasetInformationUrl = `${this.#dinsUrl}/dataset_information`;

  #datasetID = signal<string | undefined>(undefined);

  #datasetInformation = resource({
    request: computed(() => ({
      id_: this.#datasetID(),
    })),
    loader: (param) => {
      const id_ = param.request.id_;
      console.log(`${this.#datasetInformationUrl}/${id_}`);

      if (id_) {
        return Promise.resolve(
          firstValueFrom(
            this.#http.get<DatasetInformation>(`${this.#datasetInformationUrl}/${id_}`),
          ),
        );
      } else {
        return Promise.resolve(emptyDatasetInformation);
      }
    },
  });

  /**
   * The dataset information (empty while loading) as a signal
   */
  datasetInformation: Signal<DatasetInformation> = computed(
    () => this.#datasetInformation.value() ?? emptyDatasetInformation,
  );

  /**
   * Whether the dataset information is loading as a signal
   */
  datasetInformationIsLoading: Signal<boolean> = this.#datasetInformation.isLoading;

  /**
   * The dataset information error as a signal
   */
  datasetInformationError: Signal<unknown> = this.#datasetInformation.error;

  /**
   * Load the dataset with the given ID for the dataset information call
   * @param id Dataset ID
   */
  loadDatasetID(id: string): void {
    this.#datasetID.set(id);
  }
}

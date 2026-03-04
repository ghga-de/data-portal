/**
 * Service handling research upload boxes.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ConfigService } from '@app/shared/services/config';
import { BoxRetrievalResults } from '../models/box';

/**
 * Service for loading and managing upload boxes.
 */
@Injectable({ providedIn: 'root' })
export class UploadBoxService {
  #config = inject(ConfigService);
  #uosUrl = this.#config.uosUrl;
  #boxesUrl = `${this.#uosUrl}/boxes`;

  #loadAllUploadBoxes = signal<boolean>(false);

  #emptyBoxResults: BoxRetrievalResults = {
    count: 0,
    boxes: [],
  };

  /**
   * Resource for loading all upload boxes.
   */
  boxRetrievalResults = httpResource<BoxRetrievalResults>(
    () => (this.#loadAllUploadBoxes() ? this.#boxesUrl : undefined),
    {
      defaultValue: this.#emptyBoxResults,
    },
  );

  /**
   * Signal for all currently loaded upload boxes.
   */
  uploadBoxes = computed(() => this.boxRetrievalResults.value().boxes);

  /**
   * Fetch all upload boxes from the UOS backend.
   */
  loadAllUploadBoxes(): void {
    this.#loadAllUploadBoxes.set(true);
  }
}

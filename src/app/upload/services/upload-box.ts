/**
 * Service handling research upload boxes.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ConfigService } from '@app/shared/services/config';
import {
  BoxRetrievalResults,
  ResearchDataUploadBox,
  UploadBoxFilter,
} from '../models/box';

/**
 * Service for loading and managing upload boxes.
 */
@Injectable({ providedIn: 'root' })
export class UploadBoxService {
  #config = inject(ConfigService);
  #uosUrl = this.#config.uosUrl;
  #boxesUrl = `${this.#uosUrl}/boxes`;

  #loadAllUploadBoxes = signal<boolean>(false);
  #uploadBoxesFilter = signal<UploadBoxFilter | undefined>(undefined);

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
   * Current filter for upload box management.
   */
  uploadBoxesFilter = computed(
    () =>
      this.#uploadBoxesFilter() ?? {
        title: undefined,
        state: undefined,
        location: undefined,
      },
  );

  /**
   * Signal for upload boxes filtered by the active filter state.
   */
  filteredUploadBoxes = computed(() => {
    let boxes = this.uploadBoxes();
    const filter = this.#uploadBoxesFilter();
    if (!boxes.length || !filter) return boxes;

    const title = filter.title?.trim().toLowerCase();
    if (title) {
      boxes = boxes.filter((box) => box.title.toLowerCase().includes(title));
    }

    if (filter.state) {
      boxes = boxes.filter((box) => box.state === filter.state);
    }

    const location = filter.location?.trim().toLowerCase();
    if (location) {
      boxes = boxes.filter(
        (box) => box.storage_alias.trim().toLowerCase() === location,
      );
    }

    return boxes;
  });

  /**
   * All locations available in the loaded upload boxes.
   */
  uploadBoxLocations = computed(() => {
    const uniqueLocations = new Set<string>(
      this.uploadBoxes().map((box: ResearchDataUploadBox) => box.storage_alias),
    );
    return Array.from(uniqueLocations).sort((left, right) => left.localeCompare(right));
  });

  /**
   * Fetch all upload boxes from the UOS backend.
   */
  loadAllUploadBoxes(): void {
    this.#loadAllUploadBoxes.set(true);
  }

  /**
   * Set a filter for upload box management.
   * @param filter - the filter to apply
   */
  setUploadBoxesFilter(filter: UploadBoxFilter): void {
    this.#uploadBoxesFilter.set(filter);
  }
}

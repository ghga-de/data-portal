/**
 * Service handling research upload boxes.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ConfigService } from '@app/shared/services/config';
import { map, Observable } from 'rxjs';
import {
  BoxRetrievalResults,
  ResearchDataUploadBox,
  ResearchDataUploadBoxBase,
  ResearchDataUploadBoxUpdate,
  UploadBoxFilter,
} from '../models/box';

/**
 * Service for managing upload boxes.
 */
@Injectable({ providedIn: 'root' })
export class UploadBoxService {
  #config = inject(ConfigService);
  #http = inject(HttpClient);
  #uosUrl = this.#config.uosUrl;
  #boxesUrl = `${this.#uosUrl}/boxes`;
  #wkvsUrl = this.#config.wkvsUrl;
  #storageLabelsUrl = `${this.#wkvsUrl}/values/storage_labels`;

  #loadAllUploadBoxes = signal<boolean>(false);
  #uploadBoxesFilter = signal<UploadBoxFilter | undefined>(undefined);
  #loadSingleBox = signal<string>('');

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
   * Resource for loading human-readable storage labels.
   */
  storageLabels = httpResource<Record<string, string>>(
    () => (this.#loadAllUploadBoxes() ? this.#storageLabelsUrl : undefined),
    {
      parse: (raw) =>
        (raw as { storage_labels?: Record<string, string> }).storage_labels ?? {},
      defaultValue: {},
    },
  );

  /**
   * Resource for loading a single upload box.
   */
  uploadBox = httpResource<ResearchDataUploadBox>(
    () => {
      const id = this.#loadSingleBox();
      if (!id) return undefined;
      return `${this.#uosUrl}/box/${id}`;
    },
    {
      defaultValue: undefined,
      parse: (raw) => raw as ResearchDataUploadBox,
    },
  );

  /**
   * Signal for all currently loaded upload boxes.
   */
  uploadBoxes = computed(() => {
    if (this.boxRetrievalResults.error()) return [];
    return this.boxRetrievalResults.value().boxes;
  });

  /**
   * The currently active filter applied to `filteredUploadBoxes`.
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
   * All available upload-box locations including display labels.
   */
  uploadBoxLocationOptions = computed(() => {
    const labels = this.storageLabels.error() ? {} : this.storageLabels.value();
    return this.uploadBoxLocations()
      .map((locationAlias) => ({
        value: locationAlias,
        label: labels[locationAlias] ?? locationAlias,
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  });

  /**
   * Trigger loading of all upload boxes from the UOS backend.
   */
  loadAllUploadBoxes(): void {
    this.#loadAllUploadBoxes.set(true);
  }

  /**
   * Trigger loading of a single upload box by ID.
   * @param id - the ID of the upload box to load
   */
  loadUploadBox(id: string): void {
    this.#loadSingleBox.set(id);
  }

  /**
   * Create a new upload box.
   * @param data - the base data for the new upload box
   * @returns An observable that emits the ID of the created box
   */
  createUploadBox(data: ResearchDataUploadBoxBase): Observable<string> {
    return this.#http
      .post<{ id: string }>(this.#boxesUrl, data)
      .pipe(map((response) => response.id));
  }

  /**
   * Update an existing upload box.
   * @param id - the ID of the upload box to update
   * @param changes - the fields to update
   * @returns An observable that completes when the update is successful
   */
  updateUploadBox(id: string, changes: ResearchDataUploadBoxUpdate): Observable<void> {
    return this.#http.patch<void>(`${this.#boxesUrl}/${id}`, changes);
  }

  /**
   * Set the active filter for the upload box list.
   * @param filter - the filter to apply
   */
  setUploadBoxesFilter(filter: UploadBoxFilter): void {
    this.#uploadBoxesFilter.set(filter);
  }

  /**
   * Resolve a storage alias to a human-readable storage location label.
   * @param storageAlias - the alias from a box item
   * @returns the human-readable label, or the alias itself if unknown
   */
  getStorageLocationLabel(storageAlias: string): string {
    if (this.storageLabels.error()) return storageAlias;
    return this.storageLabels.value()[storageAlias] ?? storageAlias;
  }

  /**
   * Load all upload grants belonging to an upload box.
   * TODO: Implement once the backend API for upload grants is available.
   * @param _boxId - the ID of the upload box
   */
  loadUploadGrants(_boxId: string): void {
    // TODO: fetch upload grants for the given box from the backend
  }

  /**
   * Add a new upload grant to an upload box.
   * TODO: Implement once the backend API for upload grants is available.
   * @param _boxId - the ID of the upload box
   */
  addUploadGrant(_boxId: string): void {
    // TODO: POST a new upload grant for the given box to the backend
  }

  /**
   * List all files belonging to an upload box.
   * TODO: Implement once the backend API for box files is available.
   * @param _boxId - the ID of the upload box
   */
  listBoxFiles(_boxId: string): void {
    // TODO: fetch files for the given box from the backend
  }
}

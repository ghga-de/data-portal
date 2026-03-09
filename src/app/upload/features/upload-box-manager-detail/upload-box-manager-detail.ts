/**
 * Detail view for a single upload box in the upload box manager.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Capitalise } from '@app/shared/pipes/capitalise-pipe';
import { ParseBytes } from '@app/shared/pipes/parse-bytes-pipe';
import { NavigationTrackingService } from '@app/shared/services/navigation';
import { NotificationService } from '@app/shared/services/notification';
import { ResearchDataUploadBox, UploadBoxStateClass } from '@app/upload/models/box';
import { UploadBoxService } from '@app/upload/services/upload-box';

/**
 * Detail view component for managing an individual upload box.
 * Displays box metadata, upload grants (placeholder), and files (placeholder).
 */
@Component({
  selector: 'app-upload-box-manager-detail',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatIcon,
    MatTableModule,
    Capitalise,
    ParseBytes,
  ],
  templateUrl: './upload-box-manager-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadBoxManagerDetailComponent implements OnInit {
  #uploadBoxService = inject(UploadBoxService);
  #location = inject(NavigationTrackingService);
  #notificationService = inject(NotificationService);

  /** Route parameter bound automatically via withComponentInputBinding. */
  id = input.required<string>();

  /** Whether to apply the view transition animation. */
  showTransition = false;

  #singleBox = this.#uploadBoxService.uploadBox;
  #allBoxes = this.#uploadBoxService.uploadBoxes;

  #cachedBox = signal<ResearchDataUploadBox | undefined>(undefined);

  /** The upload box to display, preferring the cached value over a fresh fetch. */
  uploadBox = computed<ResearchDataUploadBox | undefined>(
    () =>
      this.#cachedBox() ||
      (this.#singleBox.error() ? undefined : this.#singleBox.value()),
  );

  /** Whether the upload box data is currently being loaded. */
  isLoading = computed<boolean>(
    () => !this.#cachedBox() && this.#singleBox.isLoading(),
  );

  /** Any error that occurred while loading the upload box. */
  error = computed<undefined | 'not found' | 'other'>(() => {
    if (this.#cachedBox()) return undefined;
    const err = this.#singleBox.error();
    if (!err) return undefined;
    return (err as HttpErrorResponse)?.status === 404 ? 'not found' : 'other';
  });

  /** The human-readable storage location label for this box. */
  storageLocationLabel = computed<string>(() =>
    this.#uploadBoxService.getStorageLocationLabel(
      this.uploadBox()?.storage_alias ?? '',
    ),
  );

  /** Map from UploadBoxState to CSS class. */
  readonly stateClass = UploadBoxStateClass;

  /** Placeholder columns for the upload grants table. */
  readonly grantColumns = ['grantee', 'status', 'validity', 'details'];

  /** Notify error effect for single-box fetch failures. */
  #errorEffect = computed(() => {
    if (this.error() === 'other') {
      this.#notificationService.showError('Error retrieving upload box details.');
    }
  });

  /**
   * On initialization, start the slide-in transition and load box data.
   * Uses the list cache if available, otherwise fetches the single box.
   */
  ngOnInit(): void {
    this.showTransition = true;
    setTimeout(() => (this.showTransition = false), 300);

    const id = this.id();
    this.#uploadBoxService.loadStorageLabels();
    if (id) {
      // Has the single box already been fetched individually?
      const single = this.#singleBox.error() ? undefined : this.#singleBox.value();
      if (single && single.id === id) {
        this.#cachedBox.set(single);
      } else {
        // Has it been loaded as part of the full list?
        const fromList = this.#allBoxes().find((b) => b.id === id);
        if (fromList) {
          this.#cachedBox.set(fromList);
        } else {
          // Neither — fetch it individually
          this.#uploadBoxService.loadUploadBox(id);
        }
      }
    }
  }

  /**
   * Navigate back to the upload box manager list.
   */
  goBack(): void {
    this.showTransition = true;
    setTimeout(() => {
      this.#location.back(['/upload-box-manager']);
    });
  }
}

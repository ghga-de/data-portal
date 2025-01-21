/**
 * Home page component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MetadataService } from '@app/metadata/services/metadata.service';
import { NotificationService } from '@app/shared/services/notification.service';

/**
 * Component for the global summary cards
 */
@Component({
  selector: 'app-global-stats',
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './global-summary.component.html',
  styleUrl: './global-summary.component.scss',
})
export class GlobalStatsComponent {
  #notify = inject(NotificationService);
  #metadata = inject(MetadataService);

  loading = this.#metadata.globalSummaryIsLoading;
  error = this.#metadata.globalSummaryError;

  #errorEffect = effect(() => {
    if (this.error()) {
      const message = 'Error fetching statistics';
      console.error(message);
      this.#notify.showWarning(message);
    }
  });

  stats = this.#metadata.globalSummary;

  datasets = computed(() => this.stats().Dataset);
  platforms = computed(() => this.stats().ExperimentMethod);
  individuals = computed(() => this.stats().Individual);
  files = computed(() => this.stats().ProcessDataFile);
}

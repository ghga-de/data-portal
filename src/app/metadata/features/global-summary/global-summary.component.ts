/**
 * Home page component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MetldataQueryService } from '@app/metadata/services/metldataQuery.service';

/**
 * Component for the global summary cards
 */
@Component({
  selector: 'app-global-stats',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './global-summary.component.html',
  styleUrl: './global-summary.component.scss',
})
export class GlobalStatsComponent {
  #metldataQuery = inject(MetldataQueryService);

  #statsError = this.#metldataQuery.globalSummaryError;

  #errorEffect = effect(() => {
    if (this.#statsError()) {
      console.log('Error fetching global summary'); // TODO: show a toast message
    }
  });

  stats = this.#metldataQuery.globalSummary;
}

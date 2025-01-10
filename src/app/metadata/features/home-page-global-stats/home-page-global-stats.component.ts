/**
 * Home page component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GlobalSummary } from '@app/metadata/models/global-summary';

/**
 * Component for the global summary cards
 */
@Component({
  selector: 'app-home-page-global-stats',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './home-page-global-stats.component.html',
  styleUrl: './home-page-global-stats.component.scss',
})
export class HomePageGlobalStatsComponent {
  #http = inject(HttpClient);
  stats = signal<GlobalSummary>({
    resource_stats: {
      Dataset: { count: 0 },
      ExperimentMethod: { count: 0, stats: { instrument_model: [] } },
      Individual: { count: 0, stats: { sex: [] } },
      SequencingProcessFile: { count: 0, stats: { format: [] } },
    },
  });

  constructor() {
    this.#http.get('api/metldata/stats').subscribe((data) => {
      try {
        console.log(data);
        this.stats.set(JSON.parse(JSON.stringify(data)));
      } catch {}
    });
  }
}

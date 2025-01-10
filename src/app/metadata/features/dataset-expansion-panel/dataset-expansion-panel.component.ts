/**
 * Component for the individual expansion panels for the metadata browser
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatasetSummary } from '@app/metadata/models/dataset-summary';
import { Hit } from '@app/metadata/models/search-results';

/**
 * Component for the expansion panel for each dataset found in the search results
 */
@Component({
  selector: 'app-dataset-expansion-panel',
  imports: [MatExpansionModule],
  templateUrl: './dataset-expansion-panel.component.html',
  styleUrl: './dataset-expansion-panel.component.scss',
})
export class DatasetExpansionPanelComponent {
  @Input()
  hit!: Hit;

  #http = inject(HttpClient);
  summary = signal<DatasetSummary>({
    title: '',
    accession: '',
    description: '',
    type: [],
    studies_summary: { count: 0, stats: { accession: '', title: '' } },
    files_summary: { count: 0, stats: { format: [] } },
    samples_summary: {
      count: 0,
      stats: { sex: [], tissues: [], phenotypic_features: [] },
    },
    experiments_summary: { count: 0, stats: { experiment_methods: [] } },
  });

  constructor() {}

  /**
   * Function to obtain the dataset summary data
   */
  GetContent() {
    this.#http
      .get(
        `/api/metldata/artifacts/stats_public/classes/DatasetStats/resources/${this.hit.id_}`,
      )
      .subscribe((data) => {
        try {
          console.log(data);
          this.summary.set(JSON.parse(JSON.stringify(data)));
        } catch {}
      });
  }
}

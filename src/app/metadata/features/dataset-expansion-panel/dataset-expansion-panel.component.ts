/**
 * Component for the individual expansion panels for the metadata browser
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, effect, inject, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Hit } from '@app/metadata/models/search-results';
import { DatasetSummaryService } from '@app/metadata/services/datasetSummary.service';

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
  hit = input.required<Hit>();
  #metadata = inject(DatasetSummaryService);

  summary = this.#metadata.datasetSummary;

  /**
   * On init, define the default values of the search variables
   */
  onOpen(): void {
    this.#metadata.load(this.hit().id_);
  }

  #errorEffect = effect(() => {
    if (this.#metadata.datasetSummaryError()) {
      console.log('Error fetching search results'); // TODO: show a toast message
    }
  });
}

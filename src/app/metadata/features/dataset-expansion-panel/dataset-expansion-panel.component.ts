/**
 * Component for the individual expansion panels for the metadata browser
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, effect, inject, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Hit } from '@app/metadata/models/search-results';
import { MetldataQueryService } from '@app/metadata/services/metldataQuery.service';

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
  #metldataQuery = inject(MetldataQueryService);

  summary = this.#metldataQuery.datasetSummary;

  /**
   * On opening of the expansible panel, load the query variables to the injectable service to prepare for the backend query
   */
  onOpen(): void {
    this.#metldataQuery.loadDatasetID(this.hit().id_);
  }

  #errorEffect = effect(() => {
    if (this.#metldataQuery.datasetSummaryError()) {
      console.log('Error fetching dataset summary'); // TODO: show a toast message
    }
  });
}

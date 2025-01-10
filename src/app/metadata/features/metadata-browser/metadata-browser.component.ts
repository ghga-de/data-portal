/**
 * Metadata browser
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { SearchResults } from '@app/metadata/models/search-results';
import { DatasetExpansionPanelComponent } from '../dataset-expansion-panel/dataset-expansion-panel.component';

/**
 * This is the metadata browser component
 */
@Component({
  selector: 'app-metadata-browser',
  imports: [MatExpansionModule, DatasetExpansionPanelComponent, MatCheckboxModule],
  templateUrl: './metadata-browser.component.html',
})
export class MetadataBrowserComponent {
  #http = inject(HttpClient);
  stats = signal<SearchResults>({ facets: [], count: 0, hits: [] });

  constructor() {
    this.#http
      .get('api/mass/search?class_name=EmbeddedDataset&limit=10')
      .subscribe((data) => {
        try {
          console.log(data);
          this.stats.set(JSON.parse(JSON.stringify(data)));
        } catch {}
      });
  }
}

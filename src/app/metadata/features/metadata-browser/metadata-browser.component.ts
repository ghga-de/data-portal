/**
 * Metadata browser
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SearchResults } from '@app/metadata/models/search-results';
import { DatasetExpansionPanelComponent } from '../dataset-expansion-panel/dataset-expansion-panel.component';

/**
 * This is the metadata browser component
 */
@Component({
  selector: 'app-metadata-browser',
  imports: [
    MatExpansionModule,
    DatasetExpansionPanelComponent,
    MatCheckboxModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './metadata-browser.component.html',
  styleUrl: './metadata-browser.component.scss',
})
export class MetadataBrowserComponent {
  #http = inject(HttpClient);
  stats = signal<SearchResults>({ facets: [], count: 0, hits: [] });

  pageSize = 10;
  length = 1;
  skip = 0;

  searchFormControl = new FormControl('');

  pageEvent!: PageEvent;

  /**
   * Function to handle a change in pagination
   * @param e PageEvent instance
   */
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.length = Math.ceil(this.stats().hits.length / this.pageSize);
    this.skip = e.pageSize * e.pageIndex;
  }

  constructor() {
    this.#http
      .get('api/mass/search?class_name=EmbeddedDataset&limit=10')
      .subscribe((data) => {
        try {
          this.stats.set(JSON.parse(JSON.stringify(data)));
        } catch {}
      });
  }
}

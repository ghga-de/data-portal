/**
 * Component for displaying search results in a list.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, inject, output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MetadataSearchService } from '@app/metadata/services/metadata-search.service';
import { DatasetExpansionPanelComponent } from '../dataset-expansion-panel/dataset-expansion-panel.component';

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_SKIP_VALUE = 0;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Component for displaying search results in a list.
 */
@Component({
  selector: 'app-search-result-list',
  imports: [MatPaginatorModule, MatExpansionModule, DatasetExpansionPanelComponent],
  templateUrl: './search-result-list.component.html',
  styleUrl: './search-result-list.component.scss',
})
export class SearchResultListComponent {
  paginate = output<PageEvent>();
  pageSize = DEFAULT_PAGE_SIZE;
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  #metadataSearch = inject(MetadataSearchService);
  results = this.#metadataSearch.searchResults;
  loading = this.#metadataSearch.searchResultsAreLoading;
  error = this.#metadataSearch.searchResultsError();
  numResults = computed(() => this.results().count);

  /**
   * Function to handle a change in pagination
   * @param e PageEvent instance
   */
  handlePageEvent(e: PageEvent) {
    console.log('PAGINIERE IM CHILD', e);
    this.pageSize = e.pageSize;
    this.paginate.emit(e);
  }
}

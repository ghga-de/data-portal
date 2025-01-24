/**
 * Metadata browser
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FacetFilterSetting } from '@app/metadata/models/facet-filter';
import { MetadataSearchService } from '@app/metadata/services/metadataSearch.service';
import { FacetActivityPipe } from '@app/metadata/utils/facetActivity.pipe';
import { NotificationService } from '@app/shared/services/notification.service';
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
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    FacetActivityPipe,
  ],
  templateUrl: './metadata-browser.component.html',
  styleUrl: './metadata-browser.component.scss',
})
export class MetadataBrowserComponent implements OnInit {
  #notify = inject(NotificationService);
  #metadataSearch = inject(MetadataSearchService);
  #className = 'EmbeddedDataset';
  facetData: FacetFilterSetting = {};
  #skip = 0;
  #pageEvent!: PageEvent;

  pageSize = 10;
  searchFormControl = new FormControl('');
  searchIsLoading = this.#metadataSearch.searchResultsAreLoading;
  searchTerm = '';
  searchResults = this.#metadataSearch.searchResults;
  lastSearchQuery = this.#metadataSearch.query;
  lastSearchFilterFacets = this.#metadataSearch.facets;

  /**
   * On init, define the default values of the search variables
   */
  ngOnInit(): void {
    this.updateMetadataServiceSearchTerms();
  }

  /**
   * Pushes the local filters, search term and page setup to the search service.
   */
  updateMetadataServiceSearchTerms(): void {
    this.#metadataSearch.loadQueryParameters(
      this.#className,
      this.pageSize,
      this.#skip,
      this.searchTerm,
      this.facetData,
    );
  }

  /**
   * Sets the parameters for the search and triggers it in the metadataSearch Service
   */
  submit(): void {
    this.updateMetadataServiceSearchTerms();
    this.#metadataSearch.triggerReload();
  }

  /**
   * Handles the click event on a facet filter that was active in the last search (as shown above the search results)
   * @param facetToRemove The facet name and option to remove.
   */
  removeFacet(facetToRemove: string): void {
    const facetToRemoveSplit = facetToRemove.split('#');
    if (facetToRemoveSplit.length !== 2) return;
    this.updateFacets(facetToRemoveSplit[0], facetToRemoveSplit[1], false);
    this.updateMetadataServiceSearchTerms();
    this.#metadataSearch.triggerReload();
  }

  /**
   * Resets the search query and triggers a reload of the results.
   */
  clearSearchQuery(): void {
    this.searchTerm = '';
    this.updateMetadataServiceSearchTerms();
    this.#metadataSearch.triggerReload();
  }

  /**
   * Clears the search field input and triggers a result update
   */
  clear(): void {
    this.searchTerm = '';
    this.facetData = {};
    this.updateMetadataServiceSearchTerms();
    this.#metadataSearch.triggerReload();
  }

  length = computed(() => this.#metadataSearch.searchResults().count);

  /**
   * Function to handle a change in pagination
   * @param e PageEvent instance
   */
  handlePageEvent(e: PageEvent) {
    this.#pageEvent = e;
    this.pageSize = e.pageSize;
    this.#skip = e.pageSize * e.pageIndex;
    this.updateMetadataServiceSearchTerms();
  }

  #errorEffect = effect(() => {
    if (this.#metadataSearch.searchResultsError()) {
      this.#notify.showError('Error fetching search results');
    }
  });

  /**
   * This function transforms the checkbox change event to the data required in updateFacet(...) and calls it
   * @param input the Event from the checkbox
   */
  onFacetFilterChanged(input: MatCheckboxChange) {
    const facetData = input.source.name?.split('#');
    if (facetData?.length != 2) {
      return;
    }
    const facetKey = facetData[0];
    const facetOption = facetData[1];
    const newValue = input.checked;
    this.updateFacets(facetKey, facetOption, newValue);
  }

  /**
   * This function handles the state change of facets filter value
   * The filter status is tracked in the #facetData dictionary
   * @param key The key of the facet to update.
   * @param option The option of the facet to update
   * @param newValue The new value of the option of the facet
   */
  updateFacets(key: string, option: string, newValue: boolean) {
    if (newValue) {
      // The value has been checked so we need to add it
      if (!this.facetData[key]) {
        this.facetData[key] = [option];
      } else {
        if (this.facetData[key].indexOf(option) == -1) {
          this.facetData[key].push(option);
        }
      }
    } else {
      // The box has been deselected so we need to remove it
      if (this.facetData[key]) {
        this.facetData[key] = this.facetData[key].filter((item) => item != option);
        if (this.facetData[key].length == 0) {
          delete this.facetData[key];
        }
      }
    }
  }
}

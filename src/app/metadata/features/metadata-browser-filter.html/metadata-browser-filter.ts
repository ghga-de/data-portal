/**
 * Metadata browser filter component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FacetFilterSetting } from '@app/metadata/models/facet-filter';
import { Facet } from '@app/metadata/models/search-results';
import { FacetActivityPipe } from '@app/metadata/pipes/facet-activity-pipe';
import { StencilComponent } from '@app/shared/ui/stencil/stencil/stencil';

/**
 * Component for the metadata browser filter
 */
@Component({
  selector: 'app-metadata-browser-filter',
  imports: [
    FacetActivityPipe,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    StencilComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './metadata-browser-filter.html',
})
export class MetadataBrowserFilterComponent {
  facets = input.required<Facet[]>();
  facetData = input.required<FacetFilterSetting>();
  loading = input.required<boolean>();
  searchFormValue = input.required<string | null>();

  cleared = output<PointerEvent>();
  submitted = output<PointerEvent | Event>();
  facetFilterChanged = output<MatCheckboxChange>();
  searchFormChanged = output<string | null>();

  searchFormControl = new FormControl('');

  searchFormGroup = new FormGroup({
    searchTerm: this.searchFormControl,
  });

  displayFilters = false;

  #searchFormValueEffect = effect(() => {
    this.searchFormControl.setValue(this.searchFormValue());
  });
}

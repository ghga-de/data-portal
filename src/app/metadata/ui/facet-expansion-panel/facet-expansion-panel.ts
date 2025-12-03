/**
 * UI Component for showing a facet, its available and selected options, as well as a search bar
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, input, output, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Facet } from '@app/metadata/models/search-results';

/**
 * Component for the facet expansion panel and options
 */
@Component({
  selector: 'app-facet-expansion-panel',
  imports: [
    MatExpansionModule,
    MatChipsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    Field,
  ],
  templateUrl: './facet-expansion-panel.html',
})
export class FacetExpansionPanelComponent {
  readonly facet = input.required<Facet>();
  readonly selectedOptions = input.required<string[]>();
  readonly expanded = input.required<boolean>();

  readonly optionRemoved = output<string>();
  readonly optionSelected = output<MatCheckboxChange>();
  readonly panelExpanded = output<boolean>();

  protected filterModel = signal({ filterText: '' });
  protected filterForm = form(this.filterModel);

  protected augmentedOptions = computed(() => {
    return this.selectedOptions()
      .map((o) => {
        const foundOption = this.facet().options.find((x) => x.value === o);
        if (foundOption) {
          return { ...foundOption, checked: true };
        }
        return { count: 0, value: o, checked: true };
      })
      .sort((a, b) => a.value.localeCompare(b.value))
      .concat(
        this.facet()
          .options.filter((o) => !this.selectedOptions().some((x) => x === o.value))
          .map((o) => {
            return { ...o, checked: false };
          }),
      );
  });
}

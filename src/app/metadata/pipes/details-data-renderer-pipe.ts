/**
 * This pipe takes the column name of a dataset details table and returns a properly formatted element for display
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Capitalise } from '@app/shared/pipes/capitalise-pipe';
import { ParseBytes } from '@app/shared/pipes/parse-bytes-pipe';
import { UnderscoreToSpace } from '@app/shared/pipes/underscore-to-space-pipe';
import { wellKnownValues } from '../models/well-known-values';

/**
 * Pipe to render dataset details table cell data
 */
@Pipe({
  name: 'detailsDataRenderer',
})
export class DetailsDataRendererPipe implements PipeTransform {
  /**
   * Pipe to render dataset details table cell data
   * @param columnDef Column definition
   * @param item Item data
   * @param accessor Accessor string
   * @param storageLabels Storage label aliases
   * @returns formatted string for display
   */
  transform(
    columnDef: string,
    item: any,
    accessor: string,
    storageLabels?: wellKnownValues,
  ): string {
    let value = item;
    accessor.split('.').forEach((key) => {
      value = value ? value[key] : undefined;
      console.log(value);
    });
    if (!value) {
      return 'N/A';
    } else if (columnDef === 'phenotype' && Array.isArray(value)) {
      return `${value.join(', ')}`;
    } else if (columnDef === 'size') {
      return `${ParseBytes.prototype.transform(value)}`;
    } else if (columnDef === 'origin') {
      return `${UnderscoreToSpace.prototype.transform(value)}`;
    } else if (columnDef === 'location') {
      return `${storageLabels && storageLabels[value] ? storageLabels[value] : value}`;
    } else if (columnDef === 'sex') {
      return `${Capitalise.prototype.transform((value as string).toLowerCase())}`;
    } else {
      return `${value}`;
    }
  }
}

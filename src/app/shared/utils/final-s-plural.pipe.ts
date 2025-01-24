/**
 * This pipe takes a js Date object and transforms it to a string of the year. This can be used in the page header but also in data views.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe can be used to display a year as a string from a Date object.
 */
@Pipe({
  name: 'addPluralS',
})
export class AddPluralS implements PipeTransform {
  /**
   * The transform method executes the business logic of the Pipe
   * @param count This function will get the number of items and returns an s if it is different than 1 (e.g. 1 method vs. 0 methods)
   * @returns An s or an empty string, depending on the number of items
   */
  transform(count: number): string {
    if (count === 1) return '';
    return 's';
  }
}

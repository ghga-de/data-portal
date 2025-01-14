/**
 * Short module description
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe can be used to display a year as a string from a Date object.
 */
@Pipe({
  name: 'dateToYear',
})
export class DateToYearPipe implements PipeTransform {
  /**
   * The transform method executes the business logic of the Pipe
   * @param date This function will get the year for the provided date and return it as a string
   * @returns the year as a string
   */
  transform(date: Date): string {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.getFullYear().toString();
    }
    return '';
  }
}

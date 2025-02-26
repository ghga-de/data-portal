/**
 * This pipe takes any string and shortens it to the first seven characters plus an ellipsis at the end.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to shorten a string to its first seven characters plus an ellipsis at the end.
 */
@Pipe({
  name: 'truncateString',
})
export class TruncateString implements PipeTransform {
  /**
   * The transform method executes the business logic of the Pipe
   * @param str The string to shorten
   * @param output_max_length The number of characters from the original string to return (excluding ellipses)
   * @param input_max_length The minimum length of string from which to start shortening
   * @returns The shortened string
   */
  transform(
    str: string,
    output_max_length: number = 7,
    input_max_length: number = 10,
  ): string {
    if (str.length > input_max_length) return str.substring(0, output_max_length) + '…';
    else return str;
  }
}

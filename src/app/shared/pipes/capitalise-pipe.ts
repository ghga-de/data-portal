/**
 * This pipe takes a string and capitalises the first letter.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to provide capitalisation for the first letter of a string.
 */
@Pipe({
  name: 'CapitalisePipe',
})
export class Capitalise implements PipeTransform {
  /**
   * This method will get a string and return it with its first letter capitalised.
   * @param str The string to capitalise
   * @param lowercaseStartingString Whether we should convert the string to lowercase first. Default is false.
   * @param capitaliseEveryWord Whether we should capitalise every word in the string. Default is false.
   * @returns The capitalised string
   */
  transform(
    str: string,
    lowercaseStartingString: boolean = false,
    capitaliseEveryWord: boolean = false,
  ): string {
    if (lowercaseStartingString) {
      str = str.toLowerCase();
    }
    if (capitaliseEveryWord) {
      return str
        .split(' ')
        .map((word) => word.substring(0, 1).toUpperCase() + word.substring(1))
        .join(' ');
    }
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }
}

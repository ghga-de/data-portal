/**
 * This pipe takes a string and replaces all instances of a given substring with another.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe can be used to replace a substring with another in a given string
 */
@Pipe({
  name: 'replaceStringPipe',
})
export class ReplaceStringPipe implements PipeTransform {
  /**
   * The transform method executes the business logic of the Pipe
   * @param input A string to perform the replacement on
   * @param stringToReplace The substring to be replaced
   * @param replacementString The substring to use as replacement
   * @returns The string with the replaced substrings
   */
  transform(input: string, stringToReplace: string, replacementString: string): string {
    if (input) {
      return input.replaceAll(stringToReplace, replacementString);
    }
    return '';
  }
}

/**
 * This pipe takes a number of bytes and transforms it into a human-readable string.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to convert number of bytes to a human-readable format
 */
@Pipe({
  name: 'parseBytes',
})
export class ParseBytes implements PipeTransform {
  /**
   * The transform method executes the business logic of the Pipe
   * @param bytes - Bytes as number
   * @returns Human readable size string, e.g. 5 kB
   */
  transform(bytes: number): string {
    const prefixes = [' B', ' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    let parsedBytes = prefixes.flatMap((prefix, index) => {
      let calculatedVal = bytes / Math.pow(1000, index);
      if (calculatedVal < 1000 && calculatedVal >= 0.1) {
        return String(Math.round(calculatedVal * 100) / 100) + prefix;
      } else return null;
    });
    var returnValue = parsedBytes.find((parsing) => parsing !== null);
    if (returnValue === undefined) returnValue = String(bytes) + prefixes[0];
    return returnValue;
  }
}

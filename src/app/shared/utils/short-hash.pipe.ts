/**
 * This pipe takes a hash (or any string) and shortens it to the first seven characters plus an ellipsis at the end.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to shorten a hash or other string to its first seven characters plus an ellipsis at the end.
 */
@Pipe({
  name: 'shortHash',
})
export class ShortHash implements PipeTransform {
  /**
   * The transform method executes the business logic of the Pipe
   * @param hash The hash to shorten
   * @returns The shortened string
   */
  transform(hash: string): string {
    if (hash.length < 7) return hash;
    else return hash.substring(0, 7) + '...';
  }
}

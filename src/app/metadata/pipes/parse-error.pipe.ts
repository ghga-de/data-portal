/**
 * Pipe for parsing HttpRequest errors and return a readable message
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform, Signal } from '@angular/core';

/**
 * Transforms an HttpRequest error signal into a readable message.
 */
@Pipe({
  name: 'parseError',
})
export class ParseErrorPipe implements PipeTransform {
  /**
   * The transform method executes the business logic of the Pipe
   * @param error A signal containing the error object.
   * @returns A string containing the error message or an empty string if the error is in the JSON parsing (which gives an HTTP200 status code)
   */
  transform(error: Signal<unknown>): string {
    if (error()) {
      const errorObj = error() as { status: number; statusText: string };
      if (errorObj.status === 200) return '';
      else return `${errorObj.status}: ${errorObj.statusText}`;
    }
    return '';
  }
}

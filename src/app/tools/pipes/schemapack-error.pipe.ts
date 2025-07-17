/**
 * A pipe to transform Schemapack errors into more readable messages
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe to transform Schemapack errors into more readable messages
 */
@Pipe({
  name: 'formatSchemapackError',
  standalone: true,
})
export class FormatSchemapackErrorPipe implements PipeTransform {
  /**
   * Transforms a raw error string by cleaning up box-drawing characters and whitespace.
   * @param errorString The raw string to format.
   * @returns A formatted, more readable error string.
   */
  transform(errorString: string | null): string {
    if (!errorString) {
      return '';
    }

    let formattedError = errorString.replace(/[╭─╮│╰╯]/g, (match) => {
      switch (match) {
        case '╭':
        case '╮':
        case '╰':
        case '╯':
        case '─':
          return '';
        case '│':
          return '  ';
        default:
          return match;
      }
    });

    formattedError = formattedError
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => line.trimEnd())
      .map((line) => line.replace(/^ {2,}/, '  '))
      .join('\n');

    return formattedError.trim();
  }
}

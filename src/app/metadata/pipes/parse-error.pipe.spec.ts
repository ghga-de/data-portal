/**
 * These are the unit tests for the ValidateDOI pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { signal } from '@angular/core';
import { ParseErrorPipe } from './parse-error.pipe';

describe('parseError', () => {
  it('can create an instance', () => {
    const pipe = new ParseErrorPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns an empty string for an undefined signal (no error)', () => {
    const pipe = new ParseErrorPipe();
    expect(pipe.transform(signal<unknown>(undefined))).toBe('');
  });

  it('returns "404: Not Found" for an error object with the correct parameters', () => {
    const pipe = new ParseErrorPipe();
    expect(
      pipe.transform(signal<unknown>({ status: 404, statusText: 'Not Found' })),
    ).toBe('404: Not Found');
  });

  it('returns an empty string for an error object with an HTTP200 status', () => {
    const pipe = new ParseErrorPipe();
    expect(pipe.transform(signal<unknown>({ status: 200, statusText: 'OK' }))).toBe('');
  });
});

/**
 * These are the unit tests for the ShortHash pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ShortHash } from './short-hash.pipe';

describe('ShortHashPipe', () => {
  it('can create an instance', () => {
    const pipe = new ShortHash();
    expect(pipe).toBeTruthy();
  });

  it('should return a 7 character long string from a longer one with an ellipsis at the end', () => {
    const pipe = new ShortHash();
    const result = pipe.transform('0a4d55a8d778e5022fab701977c5d840bbc486d0');
    expect(result).toBe('0a4d55a...');
  });

  it('should return the same string for a string with less than 7 characters', () => {
    const pipe = new ShortHash();
    const result = pipe.transform('0a4d5');
    expect(result).toBe('0a4d5');
  });
});

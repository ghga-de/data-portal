/**
 * These are the unit tests for the ReplaceStringPipe pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ReplaceStringPipe } from './replace-string-pipe';

describe('ReplaceStringPipe', () => {
  it('can create an instance', () => {
    const pipe = new ReplaceStringPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string if there was no input', () => {
    const pipe = new ReplaceStringPipe();
    const result = pipe.transform('', '', '');
    expect(result).toBe('');
  });

  it('should return a string with the given substring replaced by the replacement substring', () => {
    const pipe = new ReplaceStringPipe();
    const result = pipe.transform('Some_Test_String that we have', ' ', '_');
    expect(result).toBe('Some_Test_String_that_we_have');
  });

  it('should return the original if there are no instances of the substring to replace', () => {
    const input = 'Lorem Ipsum is your friend!';
    const pipe = new ReplaceStringPipe();
    const result = pipe.transform(input, 'zzz', '');
    expect(result).toBe(input);
  });

  it('should return the original if the two substrings are identical', () => {
    const input = 'Lorem Ipsum is your friend!';
    const pipe = new ReplaceStringPipe();
    const result = pipe.transform(input, 'Lorem', 'Lorem');
    expect(result).toBe(input);
  });
});

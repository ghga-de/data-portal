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
    const result = pipe.transform(undefined);
    expect(result).toBe('');
  });

  it('should return a string without underscores', () => {
    const pipe = new ReplaceStringPipe();
    const result = pipe.transform('Some_Test_String that we have');
    expect(result).toBe('Some Test String that we have');
  });

  it('should return the original if there are no underscores', () => {
    const input = 'Lorem Ipsum is your friend!';
    const pipe = new ReplaceStringPipe();
    const result = pipe.transform(input);
    expect(result).toBe(input);
  });
});

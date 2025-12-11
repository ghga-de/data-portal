/**
 * These are the unit tests for the Highlight Matching Text pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HighlightMatchingText } from './highlight-matching-text-pipe';

describe('HighlightMatchingTextPipe', () => {
  it('can create an instance', () => {
    const pipe = new HighlightMatchingText();
    expect(pipe).toBeTruthy();
  });

  it('should return the same text un-highlighted for an empty substr', () => {
    const pipe = new HighlightMatchingText();
    const result = pipe.transform('hello world', '');
    expect(result).toStrictEqual([{ text: 'hello world', highlighted: false }]);
  });

  it('should return the highlighted text array properly', () => {
    const pipe = new HighlightMatchingText();
    const result = pipe.transform('hello world', 'hello');
    expect(result).toStrictEqual([
      { text: 'hello', highlighted: true },
      { text: ' world', highlighted: false },
    ]);
  });

  it('should return the highlighted text array properly with multiple matches', () => {
    const pipe = new HighlightMatchingText();
    const result = pipe.transform('hello world', 'o');
    expect(result).toStrictEqual([
      { text: 'hell', highlighted: false },
      { text: 'o', highlighted: true },
      { text: ' w', highlighted: false },
      { text: 'o', highlighted: true },
      { text: 'rld', highlighted: false },
    ]);
  });

  it('should handle empty input strings correctly', () => {
    const pipe = new HighlightMatchingText();
    const result = pipe.transform('', '');
    expect(result).toStrictEqual([]);
  });

  it('should handle empty input strings correctly even with non-empty substr', () => {
    const pipe = new HighlightMatchingText();
    const result = pipe.transform('', 'test');
    expect(result).toStrictEqual([]);
  });
});

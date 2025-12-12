/**
 * These are the unit tests for the Highlight Matching Text pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HighlightMatchingText } from './highlight-matching-text';

describe('HighlightMatchingText', () => {
  it('should return the same text un-highlighted for an empty substr', () => {
    const result = HighlightMatchingText('hello world', '');
    expect(result).toStrictEqual([{ text: 'hello world', highlighted: false }]);
  });

  it('should return the highlighted text array properly', () => {
    const result = HighlightMatchingText('hello world', 'hello');
    expect(result).toStrictEqual([
      { text: 'hello', highlighted: true },
      { text: ' world', highlighted: false },
    ]);
  });

  it('should return the highlighted text array properly with multiple matches', () => {
    const result = HighlightMatchingText('hello world', 'o');
    expect(result).toStrictEqual([
      { text: 'hell', highlighted: false },
      { text: 'o', highlighted: true },
      { text: ' w', highlighted: false },
      { text: 'o', highlighted: true },
      { text: 'rld', highlighted: false },
    ]);
  });

  it('should handle empty input strings correctly', () => {
    const result = HighlightMatchingText('', '');
    expect(result).toStrictEqual([]);
  });

  it('should handle empty input strings correctly even with non-empty substr', () => {
    const result = HighlightMatchingText('', 'test');
    expect(result).toStrictEqual([]);
  });
});

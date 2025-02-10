/**
 * Test getting initial from a person's name.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { getInitials } from './initials';

describe('getInitials', () => {
  it('returns null if passed null or undefined', () => {
    expect(getInitials(null)).toBeNull();
    expect(getInitials(undefined)).toBeNull();
  });

  it('returns null if passed empty name or only whitespace', () => {
    expect(getInitials('')).toBeNull();
    expect(getInitials(' ')).toBeNull();
    expect(getInitials('   ')).toBeNull();
  });

  it('should return just one initial if there is only one name', () => {
    expect(getInitials('alice')).toBe('A');
    expect(getInitials(' bob ')).toBe('B');
    expect(getInitials('  charlie  ')).toBe('C');
  });

  it('should return both initials if there are two names', () => {
    expect(getInitials('alice brown')).toBe('AB');
    expect(getInitials(' charlie dork ')).toBe('CD');
    expect(getInitials('  eva   fudd  ')).toBe('EF');
  });

  it('should first and last initial if there are more than two names', () => {
    expect(getInitials('alice cleo brown')).toBe('AB');
    expect(getInitials(' charlie elon dork ')).toBe('CD');
    expect(getInitials('  eva  gabriela  hazel  fudd  ')).toBe('EF');
    expect(getInitials('goofy a b c d e f g hobbleton')).toBe('GH');
  });

  it('does not change case if names are already capitalized', () => {
    expect(getInitials('Alice Brown')).toBe('AB');
  });

  it('works with all kinds of whitespace', () => {
    expect(getInitials('alice\u00a0brown')).toBe('AB');
    expect(getInitials('alice\tbrown')).toBe('AB');
    expect(getInitials('alice \t \u00a0 \r \n brown')).toBe('AB');
  });
});

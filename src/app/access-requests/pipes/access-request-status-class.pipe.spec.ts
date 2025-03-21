/**
 * These are the unit tests for the access request status class pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { AccessRequestStatusClassPipe } from './access-request-status-class.pipe';

describe('AccessRequestStatusClassPipe', () => {
  it('can create an instance', () => {
    const pipe = new AccessRequestStatusClassPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return "text-error" for "denied"', () => {
    const pipe = new AccessRequestStatusClassPipe();
    const result = pipe.transform('denied');
    expect(result).toBe('text-error');
  });

  it('should return "" for "error"', () => {
    const pipe = new AccessRequestStatusClassPipe();
    const result = pipe.transform('error');
    expect(result).toBe('');
  });

  it('should return "" for ""', () => {
    const pipe = new AccessRequestStatusClassPipe();
    const result = pipe.transform('');
    expect(result).toBe('');
  });
});

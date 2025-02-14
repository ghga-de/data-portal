/**
 * Test the error handling utilities.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { getBackendErrorMessage } from './errors';

describe('getBackendErrorMessage', () => {
  it('should return an empty string for non-error types', () => {
    expect(getBackendErrorMessage(null)).toBe('');
    expect(getBackendErrorMessage(undefined)).toBe('');
    expect(getBackendErrorMessage(42)).toBe('');
    expect(getBackendErrorMessage({})).toBe('');
  });

  it('should return the string itself for an error that is a string', () => {
    const msg = 'some string error';
    const result = getBackendErrorMessage(msg);
    expect(result).toBe(msg);
  });

  it('should return the details with highest priority', () => {
    const msg = 'some detailed error';
    expect(
      getBackendErrorMessage({
        error: { detail: msg },
        status: 500,
        statusText: 'some error',
        message: 'some error',
      }),
    ).toBe(msg);
  });

  it('should return the status text with second highest priority', () => {
    const msg = 'some detailed error';
    expect(
      getBackendErrorMessage({
        status: 500,
        statusText: msg,
        message: 'some error',
      }),
    ).toBe(msg);
    expect(
      getBackendErrorMessage({
        error: { detail: '' },
        status: 500,
        statusText: msg,
        message: 'some error',
      }),
    ).toBe(msg);
  });

  it('should return the message text with lowest priority', () => {
    const msg = 'some detailed error';
    expect(
      getBackendErrorMessage({
        status: 500,
        message: msg,
      }),
    ).toBe(msg);
    expect(
      getBackendErrorMessage({
        error: { detail: '' },
        status: 500,
        statusText: '',
        message: msg,
      }),
    ).toBe(msg);
  });
});

/**
 * Helper types and functions for error handling
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

/**
 * Type for backend service errors.
 * These are usually an HTTPErrorResponses that also contain backend error details.
 * But we also want to handle the case where other kinds of errors are thrown,
 * so we allow the case that the error object is not present.
 */
export type MaybeBackendError = {
  status?: number;
  statusText?: string;
  message?: string;
  error?: { detail?: string };
};

/**
 * Get the error message from a backend error
 * @param error a backend error, but we accept any kind of error
 * @returns the most detailed and user friendly error message that can be derived
 * from the error or an empty string if no message can be extracted
 */
export function getBackendErrorMessage(
  error: MaybeBackendError | string | number | null | undefined,
): string {
  if (!error || typeof error == 'number') return '';
  if (typeof error === 'string') return error;
  return error?.error?.detail || error?.statusText || error?.message || '';
}

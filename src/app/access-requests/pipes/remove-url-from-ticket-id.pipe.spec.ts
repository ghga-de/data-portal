/**
 * These are the unit tests for the parse ticket id pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { RemoveUrlFromTicketId } from './remove-url-from-ticket-id.pipe';

describe('RemoveUrlFromTicketId', () => {
  it('can create an instance', () => {
    const pipe = new RemoveUrlFromTicketId();
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string for no ticket ID', () => {
    const pipe = new RemoveUrlFromTicketId();
    const result = pipe.transform(null);
    expect(result).toBe('');
  });

  it('should return the ticket ID for the URL https://test.com/ticket-1138/zoom', () => {
    const pipe = new RemoveUrlFromTicketId();
    const result = pipe.transform('https://test.com/ticket-1138/zoom');
    expect(result).toBe('ticket-1138');
  });

  it('should return the ticket ID for the URL http://test.com/ticket-1138', () => {
    const pipe = new RemoveUrlFromTicketId();
    const result = pipe.transform('http://test.com/ticket-1138');
    expect(result).toBe('ticket-1138');
  });

  it('should return "test" for the random string "test"', () => {
    const pipe = new RemoveUrlFromTicketId();
    const result = pipe.transform('test');
    expect(result).toBe('test');
  });

  it('should return an empty string for an URL without a pathname', () => {
    const pipe = new RemoveUrlFromTicketId();
    const result = pipe.transform('https://test.com');
    expect(result).toBe('');
  });
});

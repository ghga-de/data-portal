/**
 * These are the unit tests for the parse ticket id pipe.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ParseTicketIdPipe } from './parse-ticket-id.pipe';

describe('ParseTicketId', () => {
  it('can create an instance', () => {
    const pipe = new ParseTicketIdPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the Helpdesk URL for no ticket ID', () => {
    const pipe = new ParseTicketIdPipe();
    const result = pipe.transform(null);
    expect(result).toBe('https://youtrack-ghga.dkfz.de/');
  });

  it('should return an empty string for no ticket ID and WithBaseUrl set to false', () => {
    const pipe = new ParseTicketIdPipe();
    const result = pipe.transform(null, false);
    expect(result).toBe('');
  });

  it('should return the issue URL for the ID GSI-1138', () => {
    const pipe = new ParseTicketIdPipe();
    const result = pipe.transform('GSI-1138');
    expect(result).toBe('https://youtrack-ghga.dkfz.de/issue/GSI-1138');
  });

  it('should return the issue URL for the URL https://youtrack-ghga.dkfz.de/issue/GSI-1138', () => {
    const pipe = new ParseTicketIdPipe();
    const result = pipe.transform('https://youtrack-ghga.dkfz.de/issue/GSI-1138');
    expect(result).toBe('https://youtrack-ghga.dkfz.de/issue/GSI-1138');
  });

  it('should return the issue URL for the URL https://test.com/GSI-1138/THX-1138', () => {
    const pipe = new ParseTicketIdPipe();
    const result = pipe.transform('https://test.com/GSI-1138/THX-1138');
    expect(result).toBe('https://youtrack-ghga.dkfz.de/issue/GSI-1138');
  });

  it('should return GSI-1138 for the URL https://test.com/GSI-1138/THX-1138 and WithBaseUrl set to false', () => {
    const pipe = new ParseTicketIdPipe();
    const result = pipe.transform('https://test.com/GSI-1138/THX-1138', false);
    expect(result).toBe('GSI-1138');
  });

  it('should return GSI-1138 for the URL http://test.com/GSI-1138/THX-1138 and WithBaseUrl set to false', () => {
    const pipe = new ParseTicketIdPipe();
    const result = pipe.transform('https://test.com/GSI-1138/THX-1138', false);
    expect(result).toBe('GSI-1138');
  });

  it('should return test for the random string "test" and WithBaseUrl set to false', () => {
    const pipe = new ParseTicketIdPipe();
    const result = pipe.transform('test', false);
    expect(result).toBe('test');
  });

  it('should return https://youtrack-ghga.dkfz.de/issue/test for the random string "test"', () => {
    const pipe = new ParseTicketIdPipe();
    const result = pipe.transform('test');
    expect(result).toBe('https://youtrack-ghga.dkfz.de/issue/test');
  });
});

/**
 * This pipe takes a Helpdesk ticket ID and converts it to a clean URL
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Injectable, Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to parse a helpdesk ticket ID and convert it to a clean URL.
 */
@Pipe({
  name: 'RemoveUrlFromTicketId',
})
@Injectable({ providedIn: 'root' })
export class RemoveUrlFromTicketId implements PipeTransform {
  /**
   * Transforms a possible ticket ID url into only the ticket ID part.
   * @param ticketId The Helpdesk ticket ID or a full URL to it.
   * @returns The the ticket ID without any URL parts, if there were any, or an empty string if there was a problem parsing the URL.
   */
  transform(ticketId: string | null): string {
    if (!ticketId) return '';
    try {
      let ticketUrl: URL;
      try {
        ticketUrl = new URL(ticketId);
      } catch {
        return ticketId;
      }
      const pathParts = ticketUrl.pathname.split('/').filter((x) => x);
      if (pathParts.at(-1) === 'zoom' && pathParts.length > 1)
        ticketId = pathParts.at(-2) as string;
      else if (pathParts.length > 0) ticketId = pathParts.at(-1) as string;
      else ticketId = '';
    } catch {
      return '';
    }
    return ticketId;
  }
}

/**
 * This pipe takes a Helpdesk ticket ID and converts it to a clean URL
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to parse a helpdesk ticket ID and convert it to a clean URL.
 */
@Pipe({
  name: 'parseTicketId',
})
export class ParseTicketIdPipe implements PipeTransform {
  /**
   * Transforms a Helpdesk ticket ID into a clean URL.
   * @param ticketId The Helpdesk ticket ID or a full URL to it.
   * @param withBaseUrl Whether we should return a link to the ticket ID or just the ticket ID
   * @returns The clean URL or a base URL to the Helpdesk in case the ticket ID is invalid.
   */
  transform(ticketId: string | null, withBaseUrl: boolean = true): string {
    if (!ticketId) return withBaseUrl ? 'https://youtrack-ghga.dkfz.de/' : '';
    if (ticketId.startsWith('https://'))
      try {
        const ticketUrl = new URL(ticketId).pathname.split('/');
        ticketId = ticketUrl.at(-2) as string;
        if (ticketUrl.at(-2) === 'issue') ticketId = ticketUrl.at(-1) as string;
      } catch {
        return 'https://youtrack-ghga.dkfz.de/';
      }
    ticketId = encodeURI(ticketId);
    if (withBaseUrl) return `https://youtrack-ghga.dkfz.de/issue/${ticketId}`;
    else return ticketId;
  }
}

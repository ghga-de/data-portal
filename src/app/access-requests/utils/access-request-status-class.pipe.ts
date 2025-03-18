/**
 * This pipe takes an access request status string and returns a specific class or classes to use
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to provide status-specific classes for access request.
 */
@Pipe({
  name: 'AccessRequestStatusClassPipe',
})
export class AccessRequestStatusClassPipe implements PipeTransform {
  /**
   * This method will return a class or set of classes based on the access request status provided, or an empty string for an invalid status
   * @param status The access request status to process
   * @returns The class based on the status of the access request status sent
   */
  transform(status: string): string {
    switch (status) {
      case 'denied':
        return 'text-error';
      case 'pending':
        return 'text-info';
      case 'allowed':
        return 'text-success';

      default:
        return '';
    }
  }
}

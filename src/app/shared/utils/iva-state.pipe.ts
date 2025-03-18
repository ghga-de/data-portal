/**
 * This pipe takes an IVA state string and returns an object with the display name and text class for the specified state
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to provide state-specific display names and classes for IVAs.
 */
@Pipe({
  name: 'IvaStatePipe',
})
export class IvaStatePipe implements PipeTransform {
  /**
   * This method will return an object containing a display name and classes based on the IVA state provided, or an empty string for an invalid state
   * @param state The IVA state to process
   * @returns The display name and class based on the state of the IVA state sent in an object of shape { display: string; class: string }
   */
  transform(state: string): { display: string; class: string } {
    switch (state) {
      case 'Unverified':
        return { display: state, class: 'text-error' };
      case 'CodeRequested':
        return { display: 'Code Requested', class: 'text-warning' };
      case 'CodeCreated':
        return { display: 'Code Created', class: 'text-quaternary' };
      case 'CodeTransmitted':
        return { display: 'Code Transmitted', class: '' };
      case 'Verified':
        return { display: state, class: 'text-success' };

      default:
        return { display: state, class: '' };
    }
  }
}

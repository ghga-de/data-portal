/**
 * This pipe takes an IVA type string and returns an object with the display name and text class for the specified type
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is used to provide type-specific display names and classes for IVAs.
 */
@Pipe({
  name: 'IvaTypePipe',
})
export class IvaTypePipe implements PipeTransform {
  /**
   * This method will return an object containing a display name and classes based on the IVA type provided, or an empty string for an invalid type
   * @param type The IVA type to process
   * @param value The value of the IVA to use
   * @returns The display name and class based on the type of the IVA type sent in an object of shape { display: string; class: string }
   */
  transform(
    type: string,
    value?: string | undefined,
  ): { display: string; typeAndValue: string; icon: string } {
    if (!value) {
      value = '';
    }
    switch (type) {
      case 'Phone':
        return { display: 'SMS', typeAndValue: `SMS: ${value}`, icon: 'smartphone' };
      case 'Fax':
        return { display: type, typeAndValue: `${type}: ${value}`, icon: 'fax' };
      case 'PostalAddress':
        return {
          display: 'Postal Address',
          typeAndValue: `Postal Address: ${value}`,
          icon: 'local_post_office',
        };
      case 'InPerson':
        return {
          display: 'In Person',
          typeAndValue: `In Person: ${value}`,
          icon: 'handshakes',
        };

      default:
        return { display: type, typeAndValue: '', icon: '' };
    }
  }
}

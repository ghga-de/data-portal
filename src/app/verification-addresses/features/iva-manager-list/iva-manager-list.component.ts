/**
 * Component that lists all the IVAs.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  IvaStatePrintable,
  IvaType,
  IvaTypePrintable,
  UserWithIva,
} from '@app/verification-addresses/models/iva';
import { IvaService } from '@app/verification-addresses/services/iva.service';

const IVA_TYPE_ICONS: { [K in keyof typeof IvaType]: string } = {
  Phone: 'smartphone',
  Fax: 'fax',
  PostalAddress: 'local_post_office',
  InPerson: 'handshakes',
};

/**
 * IVA Manager List component.
 *
 * This component lists all the IVAs of all users in the IVA Manager.
 * Filter conditions can be applied to the list.
 */
@Component({
  selector: 'app-iva-manager-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './iva-manager-list.component.html',
  styleUrl: './iva-manager-list.component.scss',
})
export class IvaManagerListComponent {
  #ivaService = inject(IvaService);

  ivas = this.#ivaService.allIvas;
  ivasAreLoading = this.#ivaService.allIvasAreLoading;
  ivasError = this.#ivaService.allIvasError;

  ivaSource = new MatTableDataSource<UserWithIva>([]);

  #updateIvaSourceEffect = effect(() => (this.ivaSource.data = this.ivas()));

  /**
   * Get the type name of an IVA
   * @param iva - the IVA in question
   * @returns the printable type name
   */
  typeName(iva: UserWithIva): string {
    return IvaTypePrintable[iva.type];
  }

  /**
   * Get a suitable icon for an IVA
   * @param iva - the IVA in question
   * @returns the icon corresponding to the type
   */
  typeIconName(iva: UserWithIva): string {
    return IVA_TYPE_ICONS[iva.type];
  }

  /**
   * Get the status name of an IVA
   * @param iva - the IVA in question
   * @returns the printable status name
   */
  statusName(iva: UserWithIva): string {
    return IvaStatePrintable[iva.state];
  }
}

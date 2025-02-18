/**
 * Component that hosts the IVA Manager feature.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component } from '@angular/core';
import { IvaManagerFilterComponent } from '../iva-manager-filter/iva-manager-filter.component';
import { IvaManagerListComponent } from '../iva-manager-list/iva-manager-list.component';

/**
 * IVA Manager component.
 *
 * The IVA Manager allows data stewards to manage the IVAs of all users,
 * particularly it helps sending out verification codes to users.
 */
@Component({
  selector: 'app-iva-manager',
  imports: [
    IvaManagerListComponent,
    IvaManagerListComponent,
    IvaManagerFilterComponent,
  ],
  templateUrl: './iva-manager.component.html',
  styleUrl: './iva-manager.component.scss',
})
export class IvaManagerComponent {}

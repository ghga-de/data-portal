/**
 * Show list of IVAs belonging to the current user
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, effect, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Iva } from '@app/verification-addresses/models/iva';
import { IvaService } from '@app/verification-addresses/services/iva.service';

/**
 * Component to manage the list of IVAs belonging to the current user
 */
@Component({
  selector: 'app-user-iva-list',
  imports: [MatTableModule],
  templateUrl: './user-iva-list.component.html',
  styleUrl: './user-iva-list.component.scss',
})
export class UserIvaListComponent implements OnInit {
  #ivaService = inject(IvaService);

  ivas = this.#ivaService.userIvas;
  ivasAreloading = this.#ivaService.userIvasAreLoading;
  ivasError = this.#ivaService.userIvasError;

  ivaSource = new MatTableDataSource<Iva>([]);

  #updateIvaSourceEffect = effect(() => (this.ivaSource.data = this.ivas()));

  /**
   * Load the IVAs of the current user when the component is initialized
   */
  ngOnInit(): void {
    this.#ivaService.loadUserIvas();
  }
}

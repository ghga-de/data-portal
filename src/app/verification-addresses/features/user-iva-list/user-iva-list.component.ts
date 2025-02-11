/**
 * Show list of IVAs belonging to the current user
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, effect, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfirmationService } from '@app/shared/services/confirmation.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Iva, IvaTypePrintable } from '@app/verification-addresses/models/iva';
import { IvaService } from '@app/verification-addresses/services/iva.service';

/**
 * Component to manage the list of IVAs belonging to the current user
 */
@Component({
  selector: 'app-user-iva-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './user-iva-list.component.html',
  styleUrl: './user-iva-list.component.scss',
})
export class UserIvaListComponent implements OnInit {
  #confirm = inject(ConfirmationService);
  #notify = inject(NotificationService);
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

  /**
   * Reload the IVAs of the current user
   */
  reload(): void {
    this.#ivaService.reloadUserIvas();
  }

  /**
   * Combine type and value of an IVA to display to the user
   * @param iva - the IVA of which you want to get the type and value
   * @returns a string that combines the type and value of the IVA
   */
  typeAndValue(iva: Iva): string {
    let text = IvaTypePrintable[iva.type];
    if (iva.value) {
      text += `: ${iva.value}`;
    }
    return text;
  }

  /**
   * Request verification of the given IVA
   * @param iva - the IVA to be verified
   */
  requestVerification(iva: Iva): void {
    this.#ivaService.requestCodeForIva(iva.id).subscribe({
      next: () => {
        this.#notify.showSuccess('Verification has been requested');
      },
      error: (err) => {
        console.log(err);
        this.#notify.showError('Verification request failed');
      },
    });
  }

  /**
   * Request verification of the given IVA after confirmation from user
   * @param iva - the IVA to be verified
   */
  safeRequestVerification(iva: Iva): void {
    this.#confirm.confirm({
      title: 'Request verification of your address',
      message:
        'We will send a verification code to the selected address (' +
        this.typeAndValue(iva) +
        '). Please allow some time for processing' +
        ' your request. When the verification code has been transmitted,' +
        ' you will also be notified via e-mail.',
      callback: (confirmed) => {
        if (confirmed) this.requestVerification(iva);
      },
    });
  }

  /**
   * Delete the given IVA
   * @param iva - the IVA to delete
   */
  delete(iva: Iva): void {
    this.#ivaService.deleteIva({ ivaId: iva.id }).subscribe({
      next: () => {
        this.#notify.showSuccess('Address has been deleted');
      },
      error: (err) => {
        console.log(err);
        this.#notify.showError('Address could not be deleted');
      },
    });
  }

  /**
   * Delete the given IVA after confirmation from user
   * @param iva - the IVA to delete
   */
  safeDelete(iva: Iva): void {
    this.#confirm.confirm({
      title: 'Confirm deletion of contact address',
      message: `Please confirm deleting the ${this.typeAndValue(iva)}.`,
      cancelText: 'Cancel',
      confirmText: 'Confirm deletion',
      callback: (confirmed) => {
        if (confirmed) this.delete(iva);
      },
    });
  }
}

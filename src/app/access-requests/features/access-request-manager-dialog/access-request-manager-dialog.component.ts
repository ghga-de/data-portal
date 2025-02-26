/**
 * Dialog allowing a data steward to manage an individual access request.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe } from '@angular/common';
import { Component, effect, inject, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import {
  AccessRequest,
  AccessRequestStatus,
} from '@app/access-requests/models/access-requests';
import { NotificationService } from '@app/shared/services/notification.service';
// in this dialog we need to request the IVAs which belong to another subdomain
// eslint-disable-next-line boundaries/element-types
import { Iva, IvaTypePrintable } from '@app/verification-addresses/models/iva';
// eslint-disable-next-line boundaries/element-types
import { IvaService } from '@app/verification-addresses/services/iva.service';

/**
 * The dialog component used for managing access requests in the access request manager.
 * Currently, the data steward can only allow or deny requests, and select and IVA.
 */
@Component({
  selector: 'app-access-request-manager-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatRadioModule, DatePipe],
  templateUrl: './access-request-manager-dialog.component.html',
  styleUrl: './access-request-manager-dialog.component.scss',
})
export class AccessRequestManagerDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AccessRequestManagerDialogComponent>);
  readonly data = inject<AccessRequest>(MAT_DIALOG_DATA);
  #ivaService = inject(IvaService);
  #notificationService = inject(NotificationService);

  ivas = this.#ivaService.userIvas;
  ivasAreLoading = this.#ivaService.userIvasAreLoading;
  ivasError = this.#ivaService.userIvasError;

  ivaId = model<string | undefined>(undefined);

  #ivasErrorEffect = effect(() => {
    if (this.ivasError()) {
      this.#notificationService.showError('Error fetching verification addresses.');
    }
  });

  /**
   * Load the IVAs of the user when the component is initialized
   */
  ngOnInit(): void {
    this.#ivaService.loadUserIvas(this.data.user_id);
  }

  cancel = () => {
    this.dialogRef.close(undefined);
  };

  allow = () => {
    if (!this.ivaId) return;
    const data = {
      ...this.data,
      iva_id: this.ivaId,
      status: AccessRequestStatus.allowed,
    };
    this.dialogRef.close(data);
  };

  deny = () => {
    if (!this.ivaId) return;
    const data = {
      ...this.data,
      iva_id: this.ivaId,
      status: AccessRequestStatus.denied,
    };
    this.dialogRef.close(data);
  };

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
}

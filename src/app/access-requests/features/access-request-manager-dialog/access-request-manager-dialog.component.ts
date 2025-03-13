/**
 * Dialog allowing a data steward to manage an individual access request.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe } from '@angular/common';
import { Component, effect, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ACCESS_REQUEST_STATUS_CLASS,
  AccessRequest,
  AccessRequestStatus,
} from '@app/access-requests/models/access-requests';
import { ConfirmationService } from '@app/shared/services/confirmation.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FRIENDLY_DATE_FORMAT } from '@app/shared/utils/date-formats';
import {
  Iva,
  IVA_STATUS_CLASS,
  IvaState,
  IvaStatePrintable,
  IvaTypePrintable,
} from '@app/verification-addresses/models/iva';
import { IvaService } from '@app/verification-addresses/services/iva.service';

/**
 * The dialog component used for managing access requests in the access request manager.
 * Currently, the data steward can only allow or deny requests, and select and IVA.
 */
@Component({
  selector: 'app-access-request-manager-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    DatePipe,
    MatTooltipModule,
  ],
  templateUrl: './access-request-manager-dialog.component.html',
})
export class AccessRequestManagerDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AccessRequestManagerDialogComponent>);
  readonly data = inject<AccessRequest>(MAT_DIALOG_DATA);
  readonly friendlyDateFormat = FRIENDLY_DATE_FORMAT;
  #ivaService = inject(IvaService);
  #confirmationService = inject(ConfirmationService);
  #notificationService = inject(NotificationService);

  #ivas = this.#ivaService.userIvas;
  ivas = this.#ivas.value;
  ivasAreLoading = this.#ivas.isLoading;
  ivasError = this.#ivas.error;

  selectedIvaId = model<string | undefined>(undefined);
  accessRequestIvaId = signal<string | undefined>(undefined);

  #ivasErrorEffect = effect(() => {
    if (this.ivasError()) {
      this.#notificationService.showError('Error fetching verification addresses.');
    }
  });

  #ivasLoadedEffect = effect(() => {
    if (!this.ivasAreLoading() && !this.ivasError() && this.ivas().length) {
      this.#preSelectIva();
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

  /**
   * Allow the access request after confirmation.
   */
  safeAllow(): void {
    if (!this.selectedIvaId()) return;
    const iva = this.ivas().find((iva) => iva.id === this.selectedIvaId());
    if (!iva) return;
    const typeAndValue = this.typeAndValue(iva);
    this.#confirmationService.confirm({
      title: 'Confirm approval of the access request',
      message:
        'Please confirm that the access request shall be allowed' +
        ` and coupled to ${typeAndValue}.`,
      cancelText: 'Cancel',
      confirmText: 'Confirm approval',
      confirmClass: 'success',
      callback: (approvalConfirmed) => {
        if (approvalConfirmed) this.#allow();
      },
    });
  }

  /**
   * Deny the access request after confirmation.
   */
  safeDeny(): void {
    this.#confirmationService.confirm({
      title: 'Confirm denial of the access request',
      message: 'Please confirm that the access request shall be denied.',
      cancelText: 'Cancel',
      confirmText: 'Confirm denial',
      confirmClass: 'error',
      callback: (denialConfirmed) => {
        if (denialConfirmed) this.#deny();
      },
    });
  }

  /**
   * Allow the access request and close the dialog.
   */
  #allow = () => {
    if (!this.selectedIvaId()) return;
    const data = {
      ...this.data,
      iva_id: this.selectedIvaId,
      status: AccessRequestStatus.allowed,
    };
    this.dialogRef.close(data);
  };

  /**
   * Deny the access request and close the dialog.
   */
  #deny = () => {
    const data = {
      ...this.data,
      iva_id: this.selectedIvaId,
      status: AccessRequestStatus.denied,
    };
    this.dialogRef.close(data);
  };

  /**
   * Pre-select the IVA used for an existing access request.
   */
  #preSelectIva(): void {
    if (this.data.iva_id) {
      this.accessRequestIvaId.set(this.data.iva_id);
      this.selectedIvaId.set(this.data.iva_id);
    } else {
      this.#preSelectBestIva();
    }
  }

  /**
   * Pre-select the "best" IVA for the user.
   * The best IVA is the one which is closest to being verified and latest.
   */
  #preSelectBestIva(): void {
    let bestRank: number | undefined = undefined;
    let lastChanged: string | undefined = undefined;
    let ivaId: string | undefined = undefined;
    for (const iva of this.ivas()) {
      const rank = {
        [IvaState.Verified]: 1,
        [IvaState.CodeTransmitted]: 2,
        [IvaState.CodeCreated]: 3,
        [IvaState.CodeRequested]: 4,
        [IvaState.Unverified]: 5,
      }[iva.state];
      const changed = iva.changed;
      if (!bestRank || rank < bestRank) {
        bestRank = rank;
        lastChanged = changed;
        ivaId = iva.id;
      } else if (rank === bestRank && (!lastChanged || changed > lastChanged)) {
        lastChanged = changed;
        ivaId = iva.id;
      }
    }
    this.selectedIvaId.set(ivaId);
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
   * Get the status name of an IVA
   * @param iva - the IVA in question
   * @returns the printable status name
   */
  statusName(iva: Iva): string {
    return IvaStatePrintable[iva.state];
  }

  /**
   * Get a suitable CSS class for an IVA state's status
   * @param iva - the IVA in question
   * @returns the class corresponding to the state
   */
  statusTextClass(iva: Iva): string {
    return IVA_STATUS_CLASS[iva.state];
  }

  /**
   * Get a suitable CSS class for an access request's status
   * @param access_request - the access request in question
   * @returns the class corresponding to the state
   */
  accessRequestStatusTextClass(access_request: AccessRequest): string {
    return ACCESS_REQUEST_STATUS_CLASS[access_request.status];
  }
}

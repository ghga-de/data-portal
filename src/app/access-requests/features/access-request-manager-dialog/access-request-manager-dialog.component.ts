/**
 * Dialog allowing a data steward to manage an individual access request.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  model,
  OnInit,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  AccessRequest,
  AccessRequestStatus,
  NotesTypeSelection,
} from '@app/access-requests/models/access-requests';
import { AccessRequestStatusClassPipe } from '@app/access-requests/pipes/access-request-status-class.pipe';
import { ParseTicketIdPipe } from '@app/access-requests/pipes/parse-ticket-id.pipe';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';
import { ConfirmationService } from '@app/shared/services/confirmation.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FRIENDLY_DATE_FORMAT } from '@app/shared/utils/date-formats';
import { Iva, IvaState } from '@app/verification-addresses/models/iva';
import { IvaStatePipe } from '@app/verification-addresses/pipes/iva-state.pipe';
import { IvaTypePipe } from '@app/verification-addresses/pipes/iva-type.pipe';
import { IvaService } from '@app/verification-addresses/services/iva.service';
import { AccessRequestNoteComponent } from '../access-request-note/access-request-note.component';

export interface EditDictionary {
  name: 'ticket_id' | 'note_to_requester' | 'internal_note';
  show: boolean;
  editedValue: string | null;
}

export type EditActionType = 'show' | 'cancel' | 'save';

/**
 * The dialog component used for managing access requests in the access request manager.
 * Currently, the data steward can only allow or deny requests, and select and IVA.
 */
@Component({
  selector: 'app-access-request-manager-dialog',
  styleUrl: './access-request-manager-dialog.component.scss',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatIcon,
    DatePipe,
    AccessRequestStatusClassPipe,
    IvaTypePipe,
    IvaStatePipe,
    AccessRequestNoteComponent,
    MatChipsModule,
    MatInputModule,
    ParseTicketIdPipe,
  ],
  providers: [IvaTypePipe, ParseTicketIdPipe],
  templateUrl: './access-request-manager-dialog.component.html',
})
export class AccessRequestManagerDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AccessRequestManagerDialogComponent>);
  readonly data = inject<AccessRequest>(MAT_DIALOG_DATA);
  readonly friendlyDateFormat = FRIENDLY_DATE_FORMAT;
  #ivaService = inject(IvaService);
  #accessRequestService = inject(AccessRequestService);
  #confirmationService = inject(ConfirmationService);
  #notificationService = inject(NotificationService);

  #ivas = this.#ivaService.userIvas;
  ivas = this.#ivas.value;
  ivasAreLoading = this.#ivas.isLoading;
  ivasError = this.#ivas.error;

  #ivaTypePipe = inject(IvaTypePipe);
  #parseTicketId = inject(ParseTicketIdPipe);

  selectedIvaIdRadioButton = model<string | undefined>(undefined);

  editTicketId: EditDictionary = { name: 'ticket_id', show: false, editedValue: null };

  /**
   * Get the IVA associated with the access request.
   */
  associatedIva: Signal<Iva | undefined> = computed(() =>
    this.data.iva_id
      ? this.ivas().find((iva) => iva.id === this.data.iva_id)
      : undefined,
  );
  /**
   * Check whether the access request is changeable.
   * Currently the backend only allows to changed pending requests.
   */
  changeable: Signal<boolean> = computed(
    () => this.data.status === AccessRequestStatus.pending,
  );

  #ivasErrorEffect = effect(() => {
    if (this.ivasError()) {
      this.#notificationService.showError('Error fetching verification addresses.');
    }
  });

  #ivasLoadedEffect = effect(() => {
    if (!this.ivasAreLoading() && !this.ivasError() && this.ivas().length) {
      this.#preSelectIvaRadioButton();
    }
  });
  notes_types: NotesTypeSelection = NotesTypeSelection.both;

  /**
   * Get the display name for the IVA type
   * @param iva the IVA in question
   * @returns the display name for the type
   */
  #ivaTypeName(iva: Iva): string {
    return this.#ivaTypePipe.transform(iva.type).name;
  }

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
    if (!this.selectedIvaIdRadioButton()) return;
    const iva = this.ivas().find((iva) => iva.id === this.selectedIvaIdRadioButton());
    if (!iva) return;
    const ivaType = this.#ivaTypeName(iva);
    this.#confirmationService.confirm({
      title: 'Confirm approval of the access request',
      message:
        'Please confirm that the access request shall be allowed' +
        ` and coupled to ${ivaType}: ${iva.value}.`,
      cancelText: 'Cancel',
      confirmText: 'Confirm approval',
      confirmClass: 'success',
      callback: (approvalConfirmed) => {
        if (approvalConfirmed) this.#allowRequestAndCloseDialog();
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
  #allowRequestAndCloseDialog = () => {
    if (!this.selectedIvaIdRadioButton()) return;
    const data = {
      ...this.data,
      iva_id: this.selectedIvaIdRadioButton(),
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
      iva_id: this.selectedIvaIdRadioButton(),
      status: AccessRequestStatus.denied,
    };
    this.dialogRef.close(data);
  };

  /**
   * Pre-select the radio button for the IVA that best matches
   * (the IVA that is already selected or the best option otherwise)
   */
  #preSelectIvaRadioButton(): void {
    this.selectedIvaIdRadioButton.set(this.data.iva_id || this.#findBestIvaId());
  }

  /**
   * Get the "best" IVA for a changeable access request.
   * @returns The ID of the IVA closest to being verified and latest.
   */
  #findBestIvaId(): string | undefined {
    let bestRank: number | undefined = undefined;
    let lastChanged: string | undefined = undefined;
    let ivaId: string | undefined;
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
    return ivaId;
  }

  /**
   * Handles the editing of certain fields in the access request manager dialog.
   * @param action The action to perform as a string literal with options 'show', 'cancel', or 'save'.
   * @param editDictionary The dictionary object of the field being edited.
   */
  handleEdit(action: EditActionType, editDictionary: EditDictionary) {
    switch (action) {
      case 'show':
        editDictionary.show = true;
        editDictionary.editedValue = this.data[editDictionary.name] as string | null;
        break;

      case 'cancel':
        editDictionary.show = false;
        editDictionary.editedValue = null;
        break;

      case 'save':
        if (editDictionary.name === 'ticket_id' && editDictionary.editedValue) {
          editDictionary.editedValue = this.#parseTicketId.transform(
            editDictionary.editedValue,
            false,
          );
        }
        editDictionary.show = false;
        this.data[editDictionary.name] = editDictionary.editedValue as string;
        this.#accessRequestService.processRequest(this.data.id, {
          [editDictionary.name]: editDictionary.editedValue,
        });
        editDictionary.editedValue = null;
        break;
    }
  }
}

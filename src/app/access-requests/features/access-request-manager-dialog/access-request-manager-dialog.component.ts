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
  signal,
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
} from '@app/access-requests/models/access-requests';
import { AccessRequestStatusClassPipe } from '@app/access-requests/pipes/access-request-status-class.pipe';
import { RemoveUrlFromTicketId } from '@app/access-requests/pipes/remove-url-from-ticket-id.pipe';
import { AccessRequestFieldEditService } from '@app/access-requests/services/access-request-field-edit.service';
import { ConfigService } from '@app/shared/services/config.service';
import { ConfirmationService } from '@app/shared/services/confirmation.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { FRIENDLY_DATE_FORMAT } from '@app/shared/utils/date-formats';
import { Iva, IvaState } from '@app/verification-addresses/models/iva';
import { IvaStatePipe } from '@app/verification-addresses/pipes/iva-state.pipe';
import { IvaTypePipe } from '@app/verification-addresses/pipes/iva-type.pipe';
import { IvaService } from '@app/verification-addresses/services/iva.service';
import { AccessRequestNotesEditComponent } from '../access-request-notes-edit/access-request-notes-edit.component';

export interface EditableFieldInfo {
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
    AccessRequestNotesEditComponent,
    MatChipsModule,
    MatInputModule,
    RemoveUrlFromTicketId,
  ],
  providers: [IvaTypePipe],
  templateUrl: './access-request-manager-dialog.component.html',
})
export class AccessRequestManagerDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AccessRequestManagerDialogComponent>);
  readonly data = inject<AccessRequest>(MAT_DIALOG_DATA);
  readonly friendlyDateFormat = FRIENDLY_DATE_FORMAT;
  #ivaService = inject(IvaService);
  #confirmationService = inject(ConfirmationService);
  #notificationService = inject(NotificationService);

  #configService = inject(ConfigService);
  helpdeskTicketUrl = this.#configService.helpdeskTicketUrl;

  #ivas = this.#ivaService.userIvas;
  ivas = this.#ivas.value;
  ivasAreLoading = this.#ivas.isLoading;
  ivasError = this.#ivas.error;

  #ivaTypePipe = inject(IvaTypePipe);

  editNotesAndTicket = inject(AccessRequestFieldEditService);

  selectedIvaIdRadioButton = model<string | undefined>(undefined);

  editTicketId: Signal<EditableFieldInfo> = signal({
    name: 'ticket_id',
    show: false,
    editedValue: null,
  });
  editNoteToRequester: Signal<EditableFieldInfo> = signal({
    name: 'note_to_requester',
    show: false,
    editedValue: null,
  });
  editInternalNote: Signal<EditableFieldInfo> = signal({
    name: 'internal_note',
    show: false,
    editedValue: null,
  });

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
   * Checks if the user has pending changes before proceeding with a status change.
   * If there are unsaved edits, prompts the user to confirm discarding them before proceeding.
   * @param action String literal specifying the desired status change.
   */
  saveBeforeStatusChange(action: 'deny' | 'allow'): void {
    if (
      (this.editTicketId().editedValue &&
        this.editTicketId().editedValue !== this.data.ticket_id) ||
      (this.editNoteToRequester().editedValue &&
        this.editNoteToRequester().editedValue !== this.data.note_to_requester) ||
      (this.editInternalNote().editedValue &&
        this.editInternalNote().editedValue !== this.data.internal_note)
    ) {
      console.log(
        this.editNoteToRequester().editedValue !== this.data.note_to_requester,
      );
      this.#confirmationService.confirm({
        title: 'Unsaved changes',
        message: 'Do you want to discard your changes?',
        cancelText: 'Cancel',
        confirmText: 'Discard Changes',
        confirmClass: 'danger',
        callback: (discardConfirmed) => {
          if (discardConfirmed) {
            this.editNotesAndTicket.handleEdit(
              'cancel',
              this.editTicketId(),
              this.data,
            );
            this.editNotesAndTicket.handleEdit(
              'cancel',
              this.editNoteToRequester(),
              this.data,
            );
            this.editNotesAndTicket.handleEdit(
              'cancel',
              this.editInternalNote(),
              this.data,
            );
            if (action === 'allow') this.safeAllow();
            else this.safeDeny();
          }
        },
      });
    } else {
      if (action === 'allow') this.safeAllow();
      else this.safeDeny();
    }
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
}

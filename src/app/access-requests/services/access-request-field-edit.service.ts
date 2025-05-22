/**
 * Access Request Field Edit Service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

/* eslint-disable boundaries/element-types */
import { inject, Injectable } from '@angular/core';
import { NotificationService } from '@app/shared/services/notification.service';
import {
  EditableFieldInfo,
  EditActionType,
} from '../features/access-request-manager-dialog/access-request-manager-dialog.component';
import { AccessRequest } from '../models/access-requests';
import { RemoveUrlFromTicketId } from '../pipes/remove-url-from-ticket-id.pipe';
import { AccessRequestService } from './access-request.service';

/**
 * Handles the editing of access request fields.
 */
@Injectable({ providedIn: 'root' })
export class AccessRequestFieldEditService {
  #accessRequestService = inject(AccessRequestService);
  #parseTicketId = inject(RemoveUrlFromTicketId);
  #notificationService = inject(NotificationService);

  /**
   * Handles the editing of certain fields in the access request manager dialog.
   * @param action The action to perform as a string literal with options 'show', 'cancel', or 'save'.
   * @param editDictionary The dictionary object of the field being edited.
   * @param ar The access request to edit.
   */
  handleEdit(
    action: EditActionType,
    editDictionary: EditableFieldInfo,
    ar: AccessRequest,
  ) {
    switch (action) {
      case 'show':
        editDictionary.show = true;
        editDictionary.editedValue = ar[editDictionary.name] as string | null;
        break;

      case 'cancel':
        editDictionary.show = false;
        editDictionary.editedValue = null;
        break;

      case 'save':
        let editedValue = editDictionary.editedValue;
        if (editDictionary.name === 'ticket_id' && editDictionary.editedValue) {
          editedValue = this.#parseTicketId.transform(editDictionary.editedValue);
        }
        editDictionary.show = false;
        this.#accessRequestService
          .patchRequest(ar.id, {
            [editDictionary.name]: editedValue,
          })
          .subscribe({
            next: () => {
              this.#notificationService.showSuccess(
                `Access request was successfully modified.`,
              );
              editDictionary.editedValue = null;
            },
            error: (err) => {
              console.debug(err);
              this.#notificationService.showError(
                'Access request could not be modified. Please try again later',
              );
              editDictionary.show = true;
            },
          });
        break;
    }
  }
}

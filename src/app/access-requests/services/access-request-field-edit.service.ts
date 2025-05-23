/**
 * Access Request Field Edit Service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

/* eslint-disable boundaries/element-types */
import { inject, Injectable } from '@angular/core';
import { ConfigService } from '@app/shared/services/config.service';
import { NotificationService } from '@app/shared/services/notification.service';
import {
  EditableFieldInfo,
  EditActionType,
} from '../features/access-request-manager-dialog/access-request-manager-dialog.component';
import { AccessRequest } from '../models/access-requests';
import { AccessRequestService } from './access-request.service';

/**
 * Handles the editing of access request fields.
 */
@Injectable({ providedIn: 'root' })
export class AccessRequestFieldEditService {
  #config = inject(ConfigService);
  #ticketUrl = this.#config.helpdeskTicketUrl;
  #accessRequestService = inject(AccessRequestService);
  #notificationService = inject(NotificationService);

  /**
   * Handles the editing of certain fields in the access request manager dialog.
   * @param action The action to perform as a string literal with options 'show', 'cancel', or 'save'.
   * @param info The info about the field being edited
   * @param ar The access request to edit
   */
  handleEdit(action: EditActionType, info: EditableFieldInfo, ar: AccessRequest) {
    switch (action) {
      case 'show':
        info.show = true;
        info.editedValue = ar[info.name] as string | null;
        break;

      case 'cancel':
        info.show = false;
        info.editedValue = null;
        break;

      case 'save':
        let editedValue = info.editedValue;
        if (
          info.name === 'ticket_id' &&
          editedValue &&
          editedValue.startsWith(this.#ticketUrl)
        ) {
          editedValue = editedValue.slice(this.#ticketUrl.length);
        }
        info.show = false;
        this.#accessRequestService
          .patchRequest(ar.id, {
            [info.name]: editedValue,
          })
          .subscribe({
            next: () => {
              this.#notificationService.showSuccess(
                `Access request was successfully modified.`,
              );
              info.editedValue = null;
            },
            error: (err) => {
              console.debug(err);
              this.#notificationService.showError(
                'Access request could not be modified. Please try again later',
              );
              info.show = true;
            },
          });
        break;
    }
  }
}

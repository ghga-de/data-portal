/**
 * A smart button that either shows a button to create an access request or states that one already exists with it's state.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  AccessRequest,
  AccessRequestDialogData,
  GrantedAccessRequest,
} from '@app/access-requests/models/access-requests';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';
import { AuthService } from '@app/auth/services/auth.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { AccessRequestDialogComponent } from '../access-request-dialog/access-request-dialog.component';

/**
 * This component wraps some logic about access requests by only showing and controlling the dialog to create one if none exists so far.
 */
@Component({
  selector: 'app-dynamic-access-request-button',
  imports: [MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './dynamic-access-request-button.component.html',
  styleUrl: './dynamic-access-request-button.component.scss',
})
export class DynamicAccessRequestButtonComponent {
  datasetID = input.required<string>();
  #accessRequestService = inject(AccessRequestService);
  #auth = inject(AuthService);
  #notification = inject(NotificationService);
  #dialogRef: MatDialogRef<AccessRequestDialogComponent> | undefined;
  #dialog = inject(MatDialog);
  #userId = computed<string | null>(() => this.#auth.user()?.id || null);
  #pendingAccessRequests = computed(() =>
    this.#accessRequestService
      .pendingUserAccessRequests()
      .filter((ar: AccessRequest) => ar.dataset_id == this.datasetID()),
  );
  #activeGrantedAccessRequests = computed(() =>
    this.#accessRequestService
      .grantedUserAccessRequests()
      .filter((grantedAccessRequest: GrantedAccessRequest) => {
        const hasSameId = grantedAccessRequest.request.dataset_id == this.datasetID();
        const isValid = grantedAccessRequest.daysRemaining > 0;
        return hasSameId && isValid;
      }),
  );
  status = computed(() => {
    let newStatus = 'ok';
    for (let ar of this.#pendingAccessRequests()) {
      newStatus = ar.status;
    }
    for (let gar of this.#activeGrantedAccessRequests()) {
      newStatus = gar.request.status;
    }
    return newStatus;
  });

  showNewAccessRequestDialog = () => {
    if (!this.#auth.isAuthenticated()) {
      this.#notification.showError('You must be logged in to perform this action');
      return;
    }

    const data: AccessRequestDialogData = {
      datasetID: this.datasetID(),
      email: this.#auth.email() || '',
      description: '',
      fromDate: undefined,
      untilDate: undefined,
      userId: this.#userId() ?? '',
    };

    this.#dialogRef = this.#dialog.open(AccessRequestDialogComponent, {
      data,
    });

    this.#dialogRef.afterClosed().subscribe((componentData) => {
      if (componentData) {
        this.#processAccessRequest(componentData);
      }
    });
  };

  #processAccessRequest = (data: AccessRequestDialogData) => {
    const userid = this.#auth.user()?.id;
    if (!this.#auth.isAuthenticated() || !userid) {
      return;
    }
    data.userId = userid;

    data.fromDate?.setUTCHours(0);
    data.fromDate?.setUTCMinutes(0);
    data.fromDate?.setUTCSeconds(0);
    data.fromDate?.setUTCMilliseconds(0);
    data.untilDate?.setHours(23);
    data.untilDate?.setMinutes(59);
    data.untilDate?.setSeconds(59);
    data.untilDate?.setMilliseconds(999);
    this.#accessRequestService.performAccessRequest(data);
  };
}

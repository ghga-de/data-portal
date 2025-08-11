/**
 * A component is part of the flow to revoke an access grant.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';

/**
 * This component contains the logic to re-check the id before revoking an access grant
 */
@Component({
  selector: 'app-access-grant-revocation-button',
  imports: [
    MatIconModule,
    RouterModule,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogModule,
  ],
  templateUrl: './access-grant-revocation-dialog.component.html',
  styleUrl: './access-grant-revocation-dialog.component.scss',
})
export class AccessGrantRevocationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AccessGrantRevocationDialogComponent>);
  grantID = input.required<string>();
  idInput = model<string>();
  #ars = inject(AccessRequestService);

  /**
   * Is called if the user clicks the revoke button (meaning that they have correctly typed the name into  the field.)
   */
  onClickRevoke() {
    const ret = this.#ars.revokeAccessGrant(this.grantID());
  }

  /**
   * Is called when the cancel button is clicked.
   */
  onClickCancel() {
    return;
  }
}

/**
 * This component is part of the flow to revoke an access grant.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    MatInputModule,
  ],
  templateUrl: './access-grant-revocation-dialog.component.html',
  styleUrl: './access-grant-revocation-dialog.component.scss',
})
export class AccessGrantRevocationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AccessGrantRevocationDialogComponent>);
  readonly dialogData = inject<{ grantID: string }>(MAT_DIALOG_DATA);
  readonly grantID = this.dialogData.grantID;
  idInput = model<string>();
  #ars = inject(AccessRequestService);

  isRevoking = false;
  errorMessage: string | null = null;

  /**
   * Called when the user clicks the revoke button.
   * It attempts to revoke the grant and handles the UI response.
   */
  async onClickRevoke() {
    this.isRevoking = true;
    this.errorMessage = null;

    try {
      const wasSuccessful = await this.#ars.revokeAccessGrant(this.grantID);
      if (wasSuccessful) {
        this.dialogRef.close(true);
      } else {
        this.errorMessage = 'Failed to revoke the access grant. Please try again.';
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      this.errorMessage = 'An unexpected error occurred. Please contact support.';
    } finally {
      this.isRevoking = false;
    }
  }

  /**
   * Called when the cancel button is clicked. Closes the dialog.
   */
  onClickCancel() {
    this.dialogRef.close(false);
  }
}

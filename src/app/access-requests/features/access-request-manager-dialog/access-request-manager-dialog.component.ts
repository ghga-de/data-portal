/**
 * Dialog allowing a data steward to manage an individual access request.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  AccessRequest,
  AccessRequestStatus,
} from '@app/access-requests/models/access-requests';

/**
 * The dialog component used for managing access requests in the access request manager.
 */
@Component({
  selector: 'app-access-request-manager-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './access-request-manager-dialog.component.html',
  styleUrl: './access-request-manager-dialog.component.scss',
})
export class AccessRequestManagerDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AccessRequestManagerDialogComponent>);
  readonly data = inject<AccessRequest>(MAT_DIALOG_DATA);

  cancel = () => {
    this.dialogRef.close(undefined);
  };

  allow = () => {
    this.data.status = AccessRequestStatus.allowed;
    this.dialogRef.close(this.data);
  };

  deny = () => {
    this.data.status = AccessRequestStatus.denied;
    this.dialogRef.close(this.data);
  };
}

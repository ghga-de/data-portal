/**
 * This Component is the content of a dialog used to request access to a dataset
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccessRequestDialogData } from '@app/access-requests/models/access-requests';

/**
 * This component contains a form for all the data needed for an access request.
 */
@Component({
  selector: 'app-data-access-request-dialog',
  imports: [
    MatDatepickerModule,
    MatHint,
    MatLabel,
    MatFormField,
    MatInputModule,
    MatDialogActions,
    FormsModule,
    MatDialogContent,
    MatDialogModule,
    MatDialogTitle,
    MatButtonModule,
  ],
  templateUrl: './data-access-request-dialog.component.html',
  styleUrl: './data-access-request-dialog.component.scss',
})
export class DataAccessRequestDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DataAccessRequestDialogComponent>);
  readonly data = inject<AccessRequestDialogData>(MAT_DIALOG_DATA);
  readonly result = model(this.data);
  readonly email = model(this.data.email);
  readonly description = model(this.data.description);
  readonly fromDate = model(this.data.fromDate);
  readonly untilDate = model(this.data.untilDate);
  minFromDate = new Date();
  minUntilDate = new Date();
  datasetID = input.required<string>();

  fromDateChanged = ($event: MatDatepickerInputEvent<Date, string>) => {
    if ($event.value) {
      this.updateMinUntilDate($event.value);
    }
  };

  updateMinUntilDate = (newDate: Date) => {
    this.minUntilDate = newDate;
  };

  cancelClick = () => {
    this.data.isCanceled = true;
    this.dialogRef.close(undefined);
  };

  submitClick = () => {
    this.data.isCanceled = false;
    this.dialogRef.close(this.data);
  };
}

/**
 * This Component is the content of a dialog used to request access to a dataset
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  datasetID: string;
}

/**
 * This component contains a form for all the data needed for an access request.
 */
@Component({
  selector: 'app-data-access-request-modal',
  imports: [
    MatDatepickerModule,
    MatHint,
    MatLabel,
    MatFormField,
    MatInputModule,
    MatDialogActions,
    FormsModule,
    MatDialogContent,
  ],
  templateUrl: './data-access-request-modal.component.html',
  styleUrl: './data-access-request-modal.component.scss',
})
export class DataAccessRequestModalComponent {
  readonly dialogRef = inject(MatDialogRef<DataAccessRequestModalComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly result = model(this.data);
  readonly email = model('');
  readonly description = model('');
  readonly fromDate = model(undefined);
  readonly untilDate = model(undefined);
  minFromDate = new Date();
  minUntilDate = new Date();
  datasetID = input.required<string>();

  fromDateChanged = ($event: MatDatepickerInputEvent<Date, string>) => {
    console.log($event);
    console.log(typeof $event);
    if ($event.value) {
      this.updateMinUntilDate($event.value);
    }
  };

  updateMinUntilDate = (newDate: Date) => {
    this.minUntilDate = newDate;
  };

  cancelClick = () => {};

  submitClick = () => {};
}

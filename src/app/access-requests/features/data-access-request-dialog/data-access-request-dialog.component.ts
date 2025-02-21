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
import { ConfigService } from '@app/shared/services/config.service';

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
  #config = inject(ConfigService);
  readonly result = model(this.data);
  readonly email = model(this.data.email);
  readonly description = model(this.data.description);
  fromDate = model(this.data.fromDate);
  untilDate = model(this.data.untilDate);
  minFromDate = new Date();
  minUntilDate = new Date();
  maxFromDate = new Date();
  maxUntilDate = new Date();
  datasetID = input.required<string>();

  constructor() {
    // Sane defaults for dates.
    this.fromDate.set(new Date());
    let d = new Date();
    d.setDate(d.getDate() + this.#config.default_access_duration_days);
    this.untilDate.set(d);
    this.minUntilDate.setDate(
      this.minUntilDate.getDate() + this.#config.access_grant_min_days,
    );
  }

  fromDateChanged = ($event: MatDatepickerInputEvent<Date, string>) => {
    if ($event.value) {
      this.updateUntilRangeForFromValue($event.value);
    }
  };

  untilDateChanged = ($event: MatDatepickerInputEvent<Date, string>) => {
    if ($event.value) {
      this.updateFromRangeForUntilValue($event.value);
    }
  };

  updateFromRangeForUntilValue = (date: Date) => {
    const newUntilDate = date.getDate();
    const currentDate = new Date().getDate();
    const newFromMinDate = Math.max(
      currentDate,
      newUntilDate - this.#config.access_grant_max_days,
    );
    const newFromMaxDate = Math.min(
      newUntilDate - this.#config.access_grant_min_days,
      currentDate + this.#config.access_upfront_max_days,
    );
    this.minFromDate.setDate(new Date().setDate(newFromMinDate));
    this.maxFromDate.setDate(new Date().setDate(newFromMaxDate));
  };

  updateUntilRangeForFromValue = (date: Date) => {
    const newFromDate = date.getDate();
    const newUntilMinDate = newFromDate + this.#config.access_grant_min_days;
    const newUntilMaxDate = newFromDate + this.#config.access_grant_max_days;
    this.minUntilDate.setDate(new Date().setDate(newUntilMinDate));
    this.maxUntilDate.setDate(new Date().setDate(newUntilMaxDate));
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

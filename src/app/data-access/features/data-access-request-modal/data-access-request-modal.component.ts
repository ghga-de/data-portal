/**
 * This Component is the content of a dialog used to request access to a dataset
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, input } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatHint, MatLabel } from '@angular/material/form-field';

/**
 * This component contains a form for all the data needed for an access request.
 */
@Component({
  selector: 'app-data-access-request-modal',
  imports: [MatDatepickerModule, MatHint, MatLabel],
  templateUrl: './data-access-request-modal.component.html',
  styleUrl: './data-access-request-modal.component.scss',
})
export class DataAccessRequestModalComponent {
  datasetID = input.required<string>();
}

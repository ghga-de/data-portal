/**
 * This component is an editor for one of the access request fields.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AccessRequest } from '@app/access-requests/models/access-requests';
import { ConfigService } from '@app/shared/services/config.service';

/**
 * Editor for one of the fields of AccessRequest.
 */
@Component({
  selector: 'app-access-request-field-edit',
  imports: [
    MatDatepickerModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './access-request-field-edit.component.html',
  styleUrl: './access-request-field-edit.component.scss',
})
export class AccessRequestFieldEditComponent implements OnInit {
  #config = inject(ConfigService);
  #baseTicketUrl = this.#config.helpdeskTicketUrl;

  request = input.required<AccessRequest>();

  names = input.required<(keyof AccessRequest)[]>();
  labels = input.required<string[]>();

  isDate = input<boolean>(false);

  rows = computed<number[]>(() =>
    this.names().map((x) => (x.includes('note') ? 5 : 1)),
  );
  locked = computed<boolean>(() => this.request().status !== 'pending');

  fields = model<string[]>([]);

  saved = output<Map<keyof AccessRequest, string>>();
  edited = output<Map<keyof AccessRequest, boolean>>();

  isOpen = signal<boolean>(false);
  isModified = signal<boolean>(false);

  ticketUrl = computed<(string | null)[]>(() =>
    this.names().map((x, idx) =>
      x == 'ticket_id' && this.fields()[idx]
        ? this.#baseTicketUrl + this.fields()[idx]
        : null,
    ),
  );

  #defaultValues = computed<string[]>(() =>
    this.names().map((x) => this.request()[x] || ''),
  );

  /**
   * Populate the editable fields with the values from the access request on component init.
   */
  ngOnInit(): void {
    this.fields.update(() => this.#defaultValues().map((x) => x));
  }

  #getValues = () => {
    const names = this.names();
    let value = this.fields();
    names.map((x, idx) => {
      if (
        x === 'ticket_id' &&
        value[idx] &&
        value[idx].startsWith(this.#baseTicketUrl)
      ) {
        value[idx] = value[idx].slice(this.#baseTicketUrl.length);
      }
    });
    return value;
  };

  edit = () => {
    this.isOpen.set(true);
  };

  onDateSelected = (event: MatDatepickerInputEvent<Date>, idx: number) => {
    if (event.value) {
      const selectedLocalDate = event.value;

      const utcDateMidnight = new Date(
        Date.UTC(
          selectedLocalDate.getFullYear(),
          selectedLocalDate.getMonth(),
          selectedLocalDate.getDate(),
        ),
      );
      this.fields()[idx] = utcDateMidnight.toISOString();
      this.changed(idx);
    } else {
      this.fields()[idx] = this.#defaultValues()[idx];
      this.changed(idx);
    }
  };

  changed = (idx: number) => {
    const wasModified = this.isModified();
    const isModified = this.#getValues() !== this.#defaultValues();
    if (isModified !== wasModified) {
      this.isModified.set(isModified);
      this.edited.emit(new Map([[this.names()[idx], isModified]]));
    }
  };

  cancel = () => {
    if (this.isModified()) {
      this.fields.update(() => this.#defaultValues().map((x) => x));
      this.edited.emit(new Map(this.names().map((x) => [x, false])));
    }
    this.isOpen.set(false);
  };

  save = () => {
    const names = this.names();
    const values = this.#getValues();
    this.fields.update(() => values);
    if (this.isModified()) {
      this.saved.emit(new Map(names.map((x, idx) => [x, values[idx]])));
      this.edited.emit(new Map(names.map((x) => [x, false])));
    }
    this.isOpen.set(false);
  };
}

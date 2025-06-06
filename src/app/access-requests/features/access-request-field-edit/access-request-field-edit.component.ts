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
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AccessRequest } from '@app/access-requests/models/access-requests';
import { ConfigService } from '@app/shared/services/config.service';

const MILLISECONDS_PER_DAY = 86400000;

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
    ReactiveFormsModule,
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

  fields = model<(string | Date)[]>([]);

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

  todayMidnight = new Date();
  minFromDate = new Date();
  minUntilDate = new Date();
  maxFromDate = new Date();
  maxUntilDate = new Date();
  fieldErrorMessages = signal<string[]>([]);

  #defaultValues = computed<string[]>(() =>
    this.names().map((x) => this.request()[x] || ''),
  );

  durationFormControl: (FormControl | null)[] = [];

  constructor() {
    this.todayMidnight.setHours(0, 0, 0, 0);
    let d = new Date();
    d.setDate(d.getDate() + this.#config.defaultAccessDurationDays);
    this.minUntilDate.setDate(
      this.minUntilDate.getDate() + this.#config.accessGrantMinDays,
    );
    this.updateAccessEndRanges(new Date());
    this.updateAccessStartRanges(d);
  }

  /**
   * Populate the editable fields with the values from the access request on component init.
   */
  ngOnInit(): void {
    this.fields.update(() =>
      this.#defaultValues().map((x, idx) => {
        if (this.names()[idx] === 'access_starts' && new Date(x) < new Date())
          return new Date();
        return x;
      }),
    );

    this.durationFormControl = this.names().map((x, idx) => {
      if (x === 'access_starts')
        return new FormControl('', [
          Validators.required,
          (control) => this.#fromDateValidator(control, idx),
        ]);
      else if (x === 'access_ends')
        return new FormControl('', [
          Validators.required,
          (control) => this.#untilDateValidator(control, idx),
        ]);
      return null;
    });
    this.fieldErrorMessages.set(Array(this.names().length).fill(''));
  }

  /**
   * Update the range for the until date based on the from date
   * @param date - The from date to update the range for
   */
  updateAccessEndRanges(date: Date): void {
    const newUntilMinDate = new Date(
      date.getTime() + this.#config.accessGrantMinDays * MILLISECONDS_PER_DAY,
    );
    const newUntilMaxDate = new Date(
      date.getTime() + this.#config.accessGrantMaxDays * MILLISECONDS_PER_DAY,
    );

    this.minUntilDate = newUntilMinDate;
    this.maxUntilDate = newUntilMaxDate;
  }

  /**
   * Update the range for the from date based on the until date
   * @param date - The until date to update the range for
   */
  updateAccessStartRanges(date: Date): void {
    const currentDate = this.todayMidnight;

    const newFromMinDate = new Date(
      Math.max(
        currentDate.getTime(),
        date.getTime() - this.#config.accessGrantMaxDays * MILLISECONDS_PER_DAY,
      ),
    );
    const newFromMaxDate = new Date(
      Math.min(
        date.getTime() - this.#config.accessGrantMinDays * MILLISECONDS_PER_DAY,
        currentDate.getTime() +
          this.#config.accessUpfrontMaxDays * MILLISECONDS_PER_DAY,
      ),
    );

    this.minFromDate = newFromMinDate;
    this.maxFromDate = newFromMaxDate;
  }

  /**
   * Validate a date against a given interval
   * @param inDate - The date to validate
   * @param min - The minimum date
   * @param max - The maximum date
   * @returns a validation error with either minDate or maxDate set or null
   */
  #validateDateAgainstMinAndMax(
    inDate: Date,
    min: Date,
    max: Date,
  ): ValidationErrors | null {
    if (!inDate) return { invalid: true };
    if (inDate < min) {
      return { minDate: true };
    } else if (inDate > max) {
      return { maxDate: true };
    }
    return null;
  }

  /**
   * Get an error message for a given validation state
   * @param name - The name of the date (e.g. start or end)
   * @param error - The validation error with minDate, maxDate or invalid set
   * @returns an error message as a string
   */
  getErrorMessageForValidationState(
    name: string,
    error: ValidationErrors | null,
  ): string {
    if (!error) {
      return '';
    } else if (error['invalid']) {
      return 'Please choose a valid ' + name + ' date.';
    } else if (error['minDate']) {
      return 'Please choose a later ' + name + ' date.';
    } else if (error['maxDate']) {
      return 'Please choose an earlier ' + name + ' date.';
    } else {
      return 'Invalid ' + name + ' date.';
    }
  }

  /**
   * Validate a Form Control against the constraints of the from date
   * @param control The form Control to validate
   * @param idx The index of the field
   * @returns a validation error or null
   */
  #fromDateValidator = (
    control: AbstractControl<Date, Date>,
    idx: number,
  ): ValidationErrors | null => {
    const ret = this.#validateDateAgainstMinAndMax(
      control.value,
      this.minFromDate,
      this.maxFromDate,
    );
    this.fieldErrorMessages()[idx] = this.getErrorMessageForValidationState(
      'start',
      ret,
    );
    return ret;
  };

  /**
   * Validate a Form Control against the constraints of the until date
   * @param control The form Control to validate
   * @param idx The index of the field
   * @returns a validation error or null
   */
  #untilDateValidator = (
    control: AbstractControl<Date, Date>,
    idx: number,
  ): ValidationErrors | null => {
    const ret = this.#validateDateAgainstMinAndMax(
      control.value,
      this.minUntilDate,
      this.maxUntilDate,
    );
    this.fieldErrorMessages()[idx] = this.getErrorMessageForValidationState('end', ret);
    return ret;
  };

  #getValues = () => {
    const names = this.names();
    let value = this.fields();
    names.map((x, idx) => {
      if (
        x === 'ticket_id' &&
        value[idx] &&
        (value[idx] as string).startsWith(this.#baseTicketUrl)
      ) {
        value[idx] = (value[idx] as string).slice(this.#baseTicketUrl.length);
      }
    });
    return value;
  };

  edit = () => {
    this.isOpen.set(true);
  };

  onDateSelected = (
    selectedDate: MatDatepickerInputEvent<Date> | Date,
    idx: number,
  ) => {
    let value: Date | null;
    if (selectedDate instanceof MatDatepickerInputEvent) value = selectedDate.value;
    else value = selectedDate;
    if (value) {
      const selectedLocalDate = value;

      const utcDateMidnight = new Date(
        Date.UTC(
          selectedLocalDate.getFullYear(),
          selectedLocalDate.getMonth(),
          selectedLocalDate.getDate(),
        ),
      );
      if (this.names()[idx] === ('access_starts' as keyof AccessRequest))
        this.updateAccessEndRanges(utcDateMidnight);
      this.fields()[idx] = utcDateMidnight;
      this.changed(idx);
    } else {
      this.fields()[idx] = this.#defaultValues()[idx];
      this.changed(idx);
    }
  };

  saveDisabled = () => {
    return !this.fieldErrorMessages().every((x) => !x);
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
    this.names().map((x, idx) => {
      if (x === 'access_starts' || x === 'access_ends')
        this.onDateSelected(new Date(this.fields()[idx]), idx);
    });
    if (this.saveDisabled()) {
      const names = this.names();
      const values = this.#getValues();
      this.fields.update(() => values);
      if (this.isModified()) {
        this.saved.emit(new Map(names.map((x, idx) => [x, values[idx] as string])));
        this.edited.emit(new Map(names.map((x) => [x, false])));
      }
      this.isOpen.set(false);
    }
  };
}

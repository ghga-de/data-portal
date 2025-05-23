/**
 * This component is an editor for one of the access request fields.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AccessRequest } from '@app/access-requests/models/access-requests';
import { ConfigService } from '@app/shared/services/config.service';

/**
 * Editor for one of the fields of AccessRequest.
 */
@Component({
  selector: 'app-access-request-field-edit',
  imports: [MatChipsModule, MatIconModule, MatInputModule, FormsModule],
  templateUrl: './access-request-field-edit.component.html',
  styleUrl:
    '../access-request-manager-dialog/access-request-manager-dialog.component.scss',
})
export class AccessRequestFieldEditComponent {
  #config = inject(ConfigService);
  ticketUrl = this.#config.helpdeskTicketUrl;

  request = input.required<AccessRequest>();

  name = input.required<keyof AccessRequest>();
  label = input.required<string>();

  rows = computed<number>(() => (this.name().includes('note') ? 5 : 1));
  locked = computed<boolean>(() => this.request().status !== 'pending');

  field = model<string>('');

  saved = output<[keyof AccessRequest, string]>();
  edited = output<[keyof AccessRequest, boolean]>();

  isOpen = signal<boolean>(false);
  isModified = signal<boolean>(false);

  #defaultValue = computed<string>(() => (this.request() as any)[this.name()] || '');

  #initFieldEffect = effect(() => this.field.update(() => this.#defaultValue()));

  #getValue = () => {
    const name = this.name();
    let value = this.field();
    if (name === 'ticket_id' && value && value.startsWith(this.ticketUrl)) {
      value = value.slice(this.ticketUrl.length);
    }
    return value;
  };

  edit = () => {
    this.isOpen.set(true);
  };

  changed = () => {
    const wasModified = this.isModified();
    const isModified = this.#getValue() !== this.#defaultValue();
    if (isModified !== wasModified) {
      this.isModified.set(isModified);
      this.edited.emit([this.name(), isModified]);
    }
  };

  cancel = () => {
    if (this.isModified()) {
      this.field.update(() => this.#defaultValue());
      this.edited.emit([this.name(), false]);
    }
    this.isOpen.set(false);
  };

  save = () => {
    const name = this.name();
    if (this.isModified()) {
      this.saved.emit([name, this.#getValue()]);
      this.edited.emit([name, false]);
    }
    this.isOpen.set(false);
  };
}

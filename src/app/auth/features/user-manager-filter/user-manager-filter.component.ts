/**
 * Component to filter the list of all users.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, effect, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoleNames, UserRole, UserStatus } from '@app/auth/models/user';
import { UserService } from '@app/auth/services/user.service';
import { Capitalise } from '@app/shared/pipes/capitalise.pipe';
import { DATE_INPUT_FORMAT_HINT } from '@app/shared/utils/date-formats';

/**
 * User Manager Filter component.
 *
 * This component is used to filter the list of all users
 * in the User Manager.
 */
@Component({
  selector: 'app-user-manager-filter',
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  providers: [Capitalise],
  templateUrl: './user-manager-filter.component.html',
  styleUrl: './user-manager-filter.component.scss',
})
export class UserManagerFilterComponent {
  #userService = inject(UserService);

  #filter = this.#userService.usersFilter;

  #capitalisePipe = inject(Capitalise);

  readonly dateInputFormatHint = DATE_INPUT_FORMAT_HINT;

  /**
   * The model for the filter properties
   */
  idStrings = model<string>(this.#filter().idStrings);
  roles = model<(UserRole | null)[] | undefined>(this.#filter().roles);
  status = model<UserStatus | undefined>(this.#filter().status);
  fromDate = model<Date | undefined>(this.#filter().fromDate);
  toDate = model<Date | undefined>(this.#filter().toDate);

  /**
   * Communicate filter changes to the user service
   */
  #filterEffect = effect(() => {
    this.#userService.setUsersFilter({
      idStrings: this.idStrings(),
      roles: this.roles(),
      status: this.status(),
      fromDate: this.fromDate(),
      toDate: this.toDate(),
    });
  });

  /**
   * All user role values with printable text.
   */
  roleOptions = Object.entries(RoleNames).map((entry) => ({
    value: entry[0] as keyof typeof RoleNames,
    text: entry[1],
  }));

  /**
   * All user status values with printable text.
   */
  statusOptions = Object.entries(UserStatus).map((entry) => ({
    value: entry[0] as keyof typeof UserStatus,
    text: this.#capitalisePipe.transform(entry[1]),
  }));

  /**
   * Provides a custom label using OR as joiners, rather than commas.
   */
  roleSelection = computed(() => {
    return this.roles()
      ?.map((role: keyof typeof RoleNames | null) =>
        role ? RoleNames[role] : 'No assigned role',
      )
      .join(' OR ');
  });
}

/**
 * Component for displaying detailed information about a specific user.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe as CommonDatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayUser, UserService } from '@app/auth/services/user.service';
import { DatePipe } from '@app/shared/pipes/date.pipe';
import { FRIENDLY_DATE_FORMAT } from '@app/shared/utils/date-formats';

/**
 * User Manager Detail component.
 *
 * This component displays detailed information about a specific user
 * and allows data stewards to view and manage individual user data.
 */
@Component({
  selector: 'app-user-manager-detail',
  imports: [MatButtonModule, MatChipsModule, MatIconModule, DatePipe],
  providers: [UserService, CommonDatePipe],
  templateUrl: './user-manager-detail.component.html',
  styleUrl: './user-manager-detail.component.scss',
})
export class UserManagerDetailComponent {
  readonly friendlyDateFormat = FRIENDLY_DATE_FORMAT;

  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #userService = inject(UserService);

  #userId = computed(() => this.#route.snapshot.params['id']);
  #users = this.#userService.allUsers;

  /**
   * Get the specific user based on the route parameter
   */
  user = computed(() => {
    const userId = this.#userId();
    const users = this.#users.value();
    return users.find((user: DisplayUser) => user.id === userId);
  });

  /**
   * Navigate back to the user list
   */
  goBack(): void {
    this.#router.navigate(['/user-manager']);
  }
}

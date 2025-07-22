/**
 * Component that hosts the User Manager feature.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject } from '@angular/core';
import { UserService } from '@app/auth/services/user.service';

/**
 * User Manager component.
 *
 * The User Manager allows data stewards to manage users,
 * view user details, and perform administrative actions.
 */
@Component({
  selector: 'app-user-manager',
  imports: [],
  providers: [UserService],
  templateUrl: './user-manager.component.html',
})
export class UserManagerComponent {
  userService = inject(UserService);
}

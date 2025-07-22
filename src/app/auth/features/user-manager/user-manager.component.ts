/**
 * Component that hosts the User Manager feature.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';

/**
 * User Manager component.
 *
 * The User Manager allows data stewards to manage registered users,
 * view user user details, their IVAs and access grants and requests,
 * and delete or revoke access to the user or individual datasets.
 */
@Component({
  selector: 'app-user-manager',
  imports: [],
  templateUrl: './user-manager.component.html',
})
export class UserManagerComponent implements OnInit {
  #authService = inject(AuthService);

  /**
   * Load the users when the component is initialized
   */
  ngOnInit(): void {
    this.#authService.loadUsers();
  }
}

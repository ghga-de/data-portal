/**
 * Account button with dropdown
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@app/auth/services/auth.service';

/**
 * Account button component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */
@Component({
  selector: 'app-account-button',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './account-button.component.html',
  styleUrl: './account-button.component.scss',
})
export class AccountButtonComponent {
  #authService = inject(AuthService);
  isLoggedIn = this.#authService.isLoggedIn;

  /**
   * User login
   */
  onLogin(): void {
    this.#authService.login();
  }

  /**
   * User logout
   */
  onLogout(): void {
    this.#authService.logout();
  }
}

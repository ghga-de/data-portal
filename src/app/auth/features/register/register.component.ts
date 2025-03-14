/**
 * User registration component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, effect, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AcademicTitle, UserBasicData } from '@app/auth/models/user';

import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { NotificationService } from '@app/shared/services/notification.service';

/**
 * User registration page
 */
@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  #notify = inject(NotificationService);
  #authService = inject(AuthService);

  user = this.#authService.user;

  allTitles: AcademicTitle[] = [null, 'Dr.', 'Prof.'];

  titleControl = new FormControl<AcademicTitle>(null);

  accepted = false;

  allowNavigation = false; // used by canDeactivate guard

  /**
   * Initialize the registration component
   */
  constructor() {
    // if a re-registering user already has a title,
    // then set it as value in the control
    effect(() => {
      const title = this.user()?.title;
      if (title) {
        this.titleControl.setValue(title);
      }
    });
  }

  /**
   * Cancel registration and log out
   */
  async cancel(): Promise<void> {
    await this.#authService.logout();
  }

  /**
   * Submit registration form
   */
  async register(): Promise<void> {
    if (!this.accepted) return;
    const user = this.user();
    if (!user) return;
    const title = this.titleControl.value || null;
    const { id, ext_id, name, email } = user;
    const data: UserBasicData = { name, email, title };
    this.allowNavigation = true;
    const ok = await this.#authService.register(id || null, ext_id, data);
    if (ok) {
      this.#notify.showSuccess('Registration was successful.');
    } else {
      this.allowNavigation = false;
      this.#notify.showError('Registration failed.');
    }
  }
}

/**
 * The Account module is the parent of all account-related components in the portal
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { GrantedAccessRequestsListComponent } from '@app/access-requests/features/granted-access-requests-list/granted-access-requests-list.component';
import { PendingAccessRequestsListComponent } from '@app/access-requests/features/pending-access-requests-list/pending-access-requests-list.component';
import { AuthService } from '@app/auth/services/auth.service';

/**
 * This Component shows data about the current user and allows managing their IVAs.
 */
@Component({
  selector: 'app-account',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    PendingAccessRequestsListComponent,
    GrantedAccessRequestsListComponent,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  #auth = inject(AuthService);
  fullName = this.#auth.fullName;
  roleName = this.#auth.roleName;
  email = this.#auth.email;
}

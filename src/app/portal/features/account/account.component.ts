/**
 * The Account module is the parent of all account-related components in the portal
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@app/auth/services/auth.service';
import { GrantedAccessRequestsListComponent } from '@app/data-access/features/granted-access-requests-list/granted-access-requests-list.component';
import { PendingAccessRequestsListComponent } from '@app/data-access/features/pending-access-requests-list/pending-access-requests-list.component';

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
  auth = inject(AuthService);
}

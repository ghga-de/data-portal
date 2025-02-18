/**
 * This component shows a list of pending access requests
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataAccessService } from '@app/data-access/services/data-access.service';

/**
 * This component is used on the accounts page and shows a list of pending access requests the user has
 */
@Component({
  selector: 'app-pending-access-requests-list',
  imports: [RouterLink],
  templateUrl: './pending-access-requests-list.component.html',
  styleUrl: './pending-access-requests-list.component.scss',
})
export class PendingAccessRequestsListComponent {
  #ars = inject(DataAccessService);

  pendingRequests = this.#ars.pendingAccessRequests;
  isLoading = this.#ars.isLoading;
}

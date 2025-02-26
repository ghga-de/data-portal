/**
 * This component shows a list of pending access requests
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';
import { StencilComponent } from '../../../shared/ui/stencil/stencil/stencil.component';

/**
 * This component is used on the accounts page and shows a list of pending access requests the user has
 */
@Component({
  selector: 'app-pending-access-requests-list',
  imports: [RouterLink, StencilComponent, DatePipe],
  templateUrl: './pending-access-requests-list.component.html',
  styleUrl: './pending-access-requests-list.component.scss',
})
export class PendingAccessRequestsListComponent {
  #ars = inject(AccessRequestService);

  pendingRequests = this.#ars.pendingUserAccessRequests;
  isLoading = this.#ars.userAccessRequestsAreLoading;
  hasError = this.#ars.userAccessRequestsError;
}

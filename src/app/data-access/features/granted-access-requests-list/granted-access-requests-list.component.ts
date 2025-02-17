/**
 * Short module description
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataAccessService } from '@app/data-access/services/data-access.service';

/**
 * This component shows a list of access requests that have been granted.
 */
@Component({
  selector: 'app-granted-access-requests-list',
  imports: [RouterLink],
  templateUrl: './granted-access-requests-list.component.html',
  styleUrl: './granted-access-requests-list.component.scss',
})
export class GrantedAccessRequestsListComponent {
  #ars = inject(DataAccessService);

  grantedRequests = this.#ars.grantedAccessRequests;
  isLoading = this.#ars.isLoading;
}

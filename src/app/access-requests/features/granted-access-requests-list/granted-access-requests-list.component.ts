/**
 * Show access requests that have been granted.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';
import { StencilComponent } from '../../../shared/ui/stencil/stencil/stencil.component';

/**
 * This component shows a list of access requests that have been granted.
 */
@Component({
  selector: 'app-granted-access-requests-list',
  imports: [RouterLink, StencilComponent, DatePipe],
  templateUrl: './granted-access-requests-list.component.html',
  styleUrl: './granted-access-requests-list.component.scss',
})
export class GrantedAccessRequestsListComponent {
  #ars = inject(AccessRequestService);

  grantedRequests = this.#ars.grantedAccessRequests;
  isLoading = this.#ars.isLoading;
  hasError = this.#ars.hasError;
}

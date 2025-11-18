/**
 * Show access requests that have been granted.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { AccessRequestService } from '@app/access-requests/services/access-request';
import { FRIENDLY_DATE_FORMAT } from '@app/shared/utils/date-formats';
import { StencilComponent } from '../../../shared/ui/stencil/stencil/stencil';

/**
 * This component shows a list of access grants that have been granted.
 */
@Component({
  selector: 'app-granted-access-grants-list',
  imports: [
    RouterLink,
    StencilComponent,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './granted-access-grants-list.html',
})
export class GrantedAccessGrantsListComponent {
  readonly friendlyDateFormat = FRIENDLY_DATE_FORMAT;
  #ars = inject(AccessRequestService);

  protected grantedGrants = computed(() =>
    this.#ars.grantedUserAccessGrants().filter((r) => !r.isExpired),
  );
  protected isLoading = this.#ars.userAccessRequests.isLoading;
  protected hasError = this.#ars.userAccessRequests.error;
}

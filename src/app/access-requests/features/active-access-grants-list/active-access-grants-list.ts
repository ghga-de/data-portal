/**
 * Show access requests that have been granted.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { AccessRequestService } from '@app/access-requests/services/access-request';
import { AuthService } from '@app/auth/services/auth';
import { FRIENDLY_DATE_FORMAT } from '@app/shared/utils/date-formats';
import { Iva } from '@app/verification-addresses/models/iva';
import { IvaService } from '@app/verification-addresses/services/iva';
import { StencilComponent } from '../../../shared/ui/stencil/stencil/stencil';
import { IvaTypePipe } from '@app/verification-addresses/pipes/iva-type-pipe';

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
    IvaTypePipe,
  ],
  templateUrl: './active-access-grants-list.html',
})
export class ActiveAccessGrantsListComponent implements OnInit {
  readonly friendlyDateFormat = FRIENDLY_DATE_FORMAT;
  #ars = inject(AccessRequestService);
  #iva = inject(IvaService);
  #auth = inject(AuthService);

  protected activeGrants = computed(() => this.#ars.activeUserAccessGrants());
  protected isLoading = this.#ars.userAccessGrants.isLoading;
  protected hasError = this.#ars.userAccessGrants.error;

  #userId = computed<string | undefined>(() => this.#auth.user()?.id || undefined);

  #userIvas = computed(() =>
    this.#iva.userIvas.error() ? [] : this.#iva.userIvas.value(),
  );

  protected grantIvas = computed<(Iva | undefined)[]>(() =>
    this.activeGrants().map((g) => this.#userIvas().find((iva) => iva.id === g.iva_id)),
  );

  protected anyActiveGrantWithValidIva = computed(() =>
    this.grantIvas().some((iva) => iva?.state === 'Verified'),
  );

  ngOnInit() {
    this.#iva.loadUserIvas(this.#userId());
  }
}

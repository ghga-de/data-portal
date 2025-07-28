/**
 * Menu component for all data steward management pages
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { BaseRouteService } from '@app/shared/services/base-route.service';

/**
 * Component that shows an admin menu button with the sub menu items for data stewards
 */
@Component({
  selector: 'app-admin-menu',
  imports: [MatIconModule, MatButtonModule, MatMenuModule, RouterLink],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss',
})
export class AdminMenuComponent {
  sidenav = input<MatSidenav | undefined>();
  #auth = inject(AuthService);
  #baseRoute = inject(BaseRouteService);
  #route = this.#baseRoute.route;
  isDataSteward = computed(() => this.#auth.roles().includes('data_steward'));
  isUserManagerRoute = computed<boolean>(() => this.#route() === 'user-manager');
  isIvaManagerRoute = computed<boolean>(() => this.#route() === 'iva-manager');
  isAccessRequestsManagerRoute = computed<boolean>(
    () => this.#route() === 'access-request-manager',
  );
  isAdminRoute = computed<boolean>(
    () =>
      this.isUserManagerRoute() ||
      this.isIvaManagerRoute() ||
      this.isAccessRequestsManagerRoute(),
  );
}

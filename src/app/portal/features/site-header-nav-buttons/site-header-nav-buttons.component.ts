/**
 * Nav buttons for the header navigation, both the sidenav and the top nav
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { BaseRouteService } from '@app/shared/services/base-route.service';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';

/**
 * Component for the navigation button components
 */
@Component({
  selector: 'app-site-header-nav-buttons',
  imports: [MatIconModule, MatButtonModule, RouterLink, AdminMenuComponent],
  templateUrl: './site-header-nav-buttons.component.html',
  styleUrl: './site-header-nav-buttons.component.scss',
})
export class SiteHeaderNavButtonsComponent {
  #baseRoute = inject(BaseRouteService);
  sidenav = input<MatSidenav | undefined>();

  route = this.#baseRoute.route;
  /**
   * Whether the "Browse" navigation button should be highlighted as being active
   */
  browseActive = computed(() => ['browse', 'dataset'].includes(this.route()));
}

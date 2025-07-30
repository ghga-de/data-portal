/**
 * Service to handle view transitions for list-detail navigation
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Service to handle view transitions for list-detail navigation
 */
@Injectable({
  providedIn: 'root',
})
export class ViewTransitionService {
  #router = inject(Router);
  #previousUrl = '';
  #currentUrl = '';

  constructor() {
    this.#router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.#previousUrl = this.#currentUrl;
        this.#currentUrl = event.urlAfterRedirects;
      });
  }

  /**
   * Determines if the navigation is from list to detail
   * @returns true if navigating from list to detail view
   */
  isNavigatingToDetail(): boolean {
    return (
      this.#previousUrl.includes('/user-manager') &&
      !this.#previousUrl.includes('/user-manager/') &&
      this.#currentUrl.includes('/user-manager/')
    );
  }

  /**
   * Determines if the navigation is from detail back to list
   * @returns true if navigating from detail back to list view
   */
  isNavigatingToList(): boolean {
    return (
      this.#previousUrl.includes('/user-manager/') &&
      this.#currentUrl.includes('/user-manager') &&
      !this.#currentUrl.includes('/user-manager/')
    );
  }

  /**
   * Gets the transition class for the current navigation
   * @returns the CSS class name for the current transition type
   */
  getTransitionClass(): string {
    if (this.isNavigatingToDetail()) {
      return 'slide-to-detail';
    } else if (this.isNavigatingToList()) {
      return 'slide-to-list';
    }
    return 'default';
  }
}

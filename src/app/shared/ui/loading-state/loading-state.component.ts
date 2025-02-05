/**
 * A generic loading spinner for all places where we don't want to use a skeleton
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

/**
 * This component displays a progress spinner centred vertically and horizontally in the parent element.
 */
@Component({
  selector: 'app-loading-state',
  imports: [MatProgressSpinner],
  templateUrl: './loading-state.component.html',
  styleUrl: './loading-state.component.scss',
})
export class LoadingStateComponent {}

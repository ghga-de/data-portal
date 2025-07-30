/**
 * Component that hosts the Access Grant Manager feature.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, OnInit } from '@angular/core';

/**
 * Access Grant Manager component.
 *
 * The Access Grant Manager allows data stewards to view and manage access grants.
 */
@Component({
  selector: 'app-access-request-manager',
  imports: [AccessGrantManagerFilterComponent, AccessGrantManagerListComponent],
  templateUrl: './access-grant-manager.component.html',
})
export class AccessGrantManagerComponent implements OnInit {}

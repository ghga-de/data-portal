/**
 * Component that lists all the access requests.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AccessRequestStatusClassPipe } from '@app/access-requests/pipes/access-request-status-class.pipe';
import { DatePipe } from '@app/shared/pipes/date.pipe';

/**
 * Access Grant Manager List component.
 *
 * This component lists all the access grants of all users
 * in the Access Grant Manager. Filter conditions can be applied to the list.
 */
@Component({
  selector: 'app-access-grant-manager-list',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    AccessRequestStatusClassPipe,
    MatIconModule,
  ],
  providers: [],
  templateUrl: './access-grant-manager-list.component.html',
  styleUrl: './access-grant-manager-list.component.scss',
})
export class AccessGrantManagerListComponent {}

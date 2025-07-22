/**
 * Component that lists all the users.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatePipe as CommonDatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RegisteredUser, RoleNames } from '@app/auth/models/user';
import { UserStatusClassPipe } from '@app/auth/pipes/user-status-class.pipe';
import { UserService } from '@app/auth/services/user.service';
import { DatePipe } from '@app/shared/pipes/date.pipe';

/**
 * Enhanced user interface with computed display properties for template use
 */
interface EnhancedUser extends RegisteredUser {
  displayName: string;
  roleNames: string[];
}

/**
 * User Manager List component.
 *
 * This component lists all the registered users
 * in the User Manager. Filter conditions can be applied to the list.
 */
@Component({
  selector: 'app-user-manager-list',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    MatIconModule,
    MatChipsModule,
    UserStatusClassPipe,
  ],
  providers: [CommonDatePipe],
  templateUrl: './user-manager-list.component.html',
  styleUrl: './user-manager-list.component.scss',
})
export class UserManagerListComponent implements AfterViewInit {
  #userService = inject(UserService);

  #rawUsers = this.#userService.allUsers;
  
  // Computed signal that transforms users with display properties
  users = computed((): EnhancedUser[] =>
    this.#rawUsers.value().map((user) => ({
      ...user,
      displayName: user.title ? `${user.title} ${user.name}` : user.name,
      roleNames: user.roles.map(
        (role) => RoleNames[role as keyof typeof RoleNames] || role,
      ),
    })),
  );

  usersAreLoading = this.#rawUsers.isLoading;
  usersError = this.#rawUsers.error;

  source = new MatTableDataSource<EnhancedUser>([]);

  defaultTablePageSize = 10;
  tablePageSizeOptions = [10, 25, 50, 100, 250, 500];

  #updateSourceEffect = effect(() => (this.source.data = this.users()));

  #userSortingAccessor = (user: EnhancedUser, key: string) => {
    switch (key) {
      case 'email':
        return user.email;
      case 'name':
        return user.name;
      case 'roles':
        return user.roleNames.join(', ');
      case 'status':
        return user.status;
      case 'registration_date':
        return user.registration_date;
      default:
        const value = user[key as keyof EnhancedUser];
        if (typeof value === 'string' || typeof value === 'number') {
          return value;
        }
        return '';
    }
  };

  @ViewChildren(MatSort) matSorts!: QueryList<MatSort>;
  @ViewChildren(MatPaginator) matPaginators!: QueryList<MatPaginator>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  /**
   * Assign sorting
   */
  #addSorting() {
    if (this.sort) this.source.sort = this.sort;
  }

  /**
   * Assign pagination
   */
  #addPagination() {
    if (this.paginator) this.source.paginator = this.paginator;
  }

  /**
   * After the view has been initialised
   * assign the sorting of the table to the data source
   */
  ngAfterViewInit() {
    this.source.sortingDataAccessor = this.#userSortingAccessor;
    this.#addSorting();
    this.#addPagination();
    this.matSorts.changes.subscribe(() => this.#addSorting());
    this.matPaginators.changes.subscribe(() => this.#addPagination());
  }

  /**
   * Open the details view for a user (placeholder for future implementation)
   * @param row - the selected user row
   */
  openDetails(row: EnhancedUser): void {
    // TODO: Implement user details dialog
    console.log('User details clicked:', row);
  }
}

/**
 * Component that lists all the IVAs.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import {
  AfterViewInit,
  Component,
  effect,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfirmationService } from '@app/shared/services/confirmation.service';
import { NotificationService } from '@app/shared/services/notification.service';
import {
  IvaStatePrintable,
  IvaType,
  IvaTypePrintable,
  UserWithIva,
} from '@app/verification-addresses/models/iva';
import { IvaService } from '@app/verification-addresses/services/iva.service';

const IVA_TYPE_ICONS: { [K in keyof typeof IvaType]: string } = {
  Phone: 'smartphone',
  Fax: 'fax',
  PostalAddress: 'local_post_office',
  InPerson: 'handshakes',
};

/**
 * IVA Manager List component.
 *
 * This component lists all the IVAs of all users in the IVA Manager.
 * Filter conditions can be applied to the list.
 */
@Component({
  selector: 'app-iva-manager-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './iva-manager-list.component.html',
  styleUrl: './iva-manager-list.component.scss',
})
export class IvaManagerListComponent implements AfterViewInit {
  #confirm = inject(ConfirmationService);
  #notify = inject(NotificationService);
  #ivaService = inject(IvaService);

  ivas = this.#ivaService.allIvas;
  ivasAreLoading = this.#ivaService.allIvasAreLoading;
  ivasError = this.#ivaService.allIvasError;

  source = new MatTableDataSource<UserWithIva>([]);

  defaultTablePageSize = 10;
  tablePageSizeOptions = [5, 10, 25, 50, 100, 250, 500];

  #updateSourceEffect = effect(() => (this.source.data = this.ivas()));

  #ivaSortingAccessor = (iva: UserWithIva, key: string) => {
    switch (key) {
      case 'user':
        const parts = iva.user_name.split(' ');
        return parts.reverse().join(',');
      default:
        const value = iva[key as keyof UserWithIva];
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
    this.source.sortingDataAccessor = this.#ivaSortingAccessor;
    this.#addSorting();
    this.#addPagination();
    this.matSorts.changes.subscribe(() => this.#addSorting());
    this.matPaginators.changes.subscribe(() => this.#addPagination());
  }

  /**
   * Get the type name of an IVA
   * @param iva - the IVA in question
   * @returns the printable type name
   */
  typeName(iva: UserWithIva): string {
    return IvaTypePrintable[iva.type];
  }

  /**
   * Get a suitable icon for an IVA
   * @param iva - the IVA in question
   * @returns the icon corresponding to the type
   */
  typeIconName(iva: UserWithIva): string {
    return IVA_TYPE_ICONS[iva.type];
  }

  /**
   * Get the status name of an IVA
   * @param iva - the IVA in question
   * @returns the printable status name
   */
  statusName(iva: UserWithIva): string {
    return IvaStatePrintable[iva.state];
  }

  /**
   * Confirm the transmission of an IVA verification code
   * @param iva - the IVA to confirm the transmission for
   */
  confirmTransmission(iva: UserWithIva) {
    console.log('confirm', iva);
  }

  /**
   * Create confirmation code for an IVA
   * @param iva - the IVA to create a verification code for
   */
  createCode(iva: UserWithIva) {
    console.log('create code', iva);
  }

  /**
   * Invalidate the given IVA
   * @param iva - the IVA to be invalidated
   */
  #invalidate(iva: UserWithIva): void {
    this.#ivaService.unverifyIva(iva.id).subscribe({
      next: () => {
        this.#notify.showSuccess('IVA has been invalidated');
      },
      error: (err) => {
        console.debug(err);
        this.#notify.showError('IVA could not be invalidated');
      },
    });
  }

  /**
   * Invalidate an IVA after confirmation
   * @param iva - the IVA to invalidate
   */
  invalidate(iva: UserWithIva) {
    this.#confirm.confirm({
      title: 'Confirm invalidation of IVA',
      message:
        `Do you really wish to invalidate the ${this.typeName(iva)} IVA of` +
        ` ${iva.user_name} with value ${iva.value}?` +
        ' The user will lose access to any dataset linked to this IVA.',
      cancelText: 'Cancel',
      confirmText: 'Confirm invalidation',
      callback: (confirmed) => {
        if (confirmed) this.#invalidate(iva);
      },
    });
  }
}

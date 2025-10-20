/**
 * Component for showing the dataset details tables
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatasetDetailsTableColumn } from '@app/metadata/models/dataset-details-table';
import { WellKnownValueService } from '@app/metadata/services/well-known-value';
import { ParseBytes } from '@app/shared/pipes/parse-bytes-pipe';
import { UnderscoreToSpace } from '@app/shared/pipes/underscore-to-space-pipe';
import { NotificationService } from '@app/shared/services/notification';

/**
 * Component for the dataset details table
 */
@Component({
  selector: 'app-dataset-details-table',
  imports: [
    ClipboardModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ParseBytes,
    UnderscoreToSpace,
  ],
  templateUrl: './dataset-details-table.html',
  styleUrl: './dataset-details-table.scss',
})
export class DatasetDetailsTableComponent implements AfterViewInit {
  header = input.required<string>();
  data = input.required<any[]>();
  dataSource = input.required<MatTableDataSource<any, MatPaginator>>();
  columns = input.required<DatasetDetailsTableColumn[]>();
  sortingDataAccessor = input.required<(arg0: any, key: string) => string | number>();

  numItems = computed(() => this.data().length);
  displayCols = computed(() =>
    this.columns().flatMap((x) => (x.hidden ? '' : x.columnDef)),
  );

  #notify = inject(NotificationService);
  #wkvs = inject(WellKnownValueService);
  #storageLabels = this.#wkvs.storageLabels;
  storageLabels = this.#storageLabels.value;

  defaultTablePageSize = 10;
  tablePageSizeOptions = [10, 25, 50, 100];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatSort) matSorts!: QueryList<MatSort>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren(MatPaginator) matPaginators!: QueryList<MatPaginator>;

  #updateDataSourceEffect = effect(() => (this.dataSource().data = this.data()));

  /**
   * After the view has been initialised
   * assign the sorting of the tables to the data sources
   */
  ngAfterViewInit() {
    this.dataSource().sortingDataAccessor = this.sortingDataAccessor();

    this.matSorts.changes.subscribe(() => {
      if (this.data()) this.dataSource().sort = this.sort;
    });
    this.matPaginators.changes.subscribe(() => {
      if (this.paginator) this.dataSource().paginator = this.paginator;
    });
  }

  /**
   * Function to notify user that full hash was copied to clipboard
   */
  notifyCopied() {
    this.#notify.showInfo('Complete file hash copied to clipboard', 1000);
  }
}

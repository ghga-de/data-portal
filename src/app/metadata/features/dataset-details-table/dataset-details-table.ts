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
  forwardRef,
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
import {
  datasetDetailsTableColumns,
  dataSortingDataAccessor,
} from '@app/metadata/models/dataset-details-table';
import { DetailsDataRendererPipe } from '@app/metadata/pipes/details-data-renderer-pipe';
import { WellKnownValueService } from '@app/metadata/services/well-known-value';
import { NotificationService } from '@app/shared/services/notification';

/**
 * Component for the dataset details table
 */
@Component({
  selector: 'app-dataset-details-table',
  imports: [
    DetailsDataRendererPipe,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    forwardRef(() => DatasetDetailsTableHashCellComponent),
  ],
  templateUrl: './dataset-details-table.html',
  styleUrl: './dataset-details-table.scss',
})
export class DatasetDetailsTableComponent implements AfterViewInit {
  tableName = input.required<string>();
  data = input.required<any[]>();
  header = input.required<string>();

  numItems = computed(() => this.data().length);
  parsedByted = computed(() =>
    this.tableName() === 'files'
      ? this.data().reduce((acc, file) => acc + (file.size ?? 0), 0)
      : 0,
  );

  columns = computed(() =>
    this.tableName ? (datasetDetailsTableColumns[this.tableName()] ?? []) : [],
  );
  sortingDataAccessor = computed(() =>
    this.tableName ? dataSortingDataAccessor[this.tableName()] : undefined,
  );

  caption = computed(() => `Dataset ${this.header().split(' ')[0]}`);
  dataSource = new MatTableDataSource<any>([]);

  displayCols = computed(() =>
    this.columns().flatMap((x) => (x.hidden ? '' : x.columnDef)),
  );

  #wkvs = inject(WellKnownValueService);
  #storageLabels = this.#wkvs.storageLabels;
  storageLabels = this.#storageLabels.value;

  defaultTablePageSize = 10;
  tablePageSizeOptions = [10, 25, 50, 100];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatSort) matSorts!: QueryList<MatSort>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren(MatPaginator) matPaginators!: QueryList<MatPaginator>;

  #updateDataSourceEffect = effect(() => (this.dataSource.data = this.data()));

  /**
   * After the view has been initialised
   * assign the sorting of the tables to the data sources
   */
  ngAfterViewInit() {
    if (this.sortingDataAccessor()) {
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor()!;
    }

    this.matSorts.changes.subscribe(() => {
      if (this.data()) this.dataSource.sort = this.sort;
    });
    this.matPaginators.changes.subscribe(() => {
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }
}

/**
 * Component for rendering the cell for the file hash
 */
@Component({
  selector: 'app-dataset-details-table-hash-cell',
  imports: [MatButtonModule, MatIconModule, ClipboardModule],
  template: `
    @if (hash()) {
      <span
        class="inline-block max-w-[10ex] overflow-hidden font-mono text-ellipsis whitespace-nowrap"
        title="{{ hash() }}"
        >{{ hash() }}</span
      >
      <button
        mat-icon-button
        cdkCopyToClipboard="{{ hash() }}"
        (cdkCopyToClipboardCopied)="notifyCopied()"
        aria-label="Copy full hash to clipboard"
      >
        <mat-icon>content_copy</mat-icon>
      </button>
    } @else {
      N/A
    }
  `,
})
export class DatasetDetailsTableHashCellComponent {
  hash = input.required<string>();

  #notify = inject(NotificationService);

  /**
   * Function to notify user that full hash was copied to clipboard
   */
  notifyCopied() {
    this.#notify.showInfo('Complete file hash copied to clipboard', 1000);
  }
}

/**
 * Short module description
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Location } from '@angular/common';
import { Component, computed, effect, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MetadataService } from '@app/metadata/services/metadata.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { AddPluralS } from '@app/shared/utils/add-plural-s.pipe';
import { UnderscoreToSpace } from '@app/shared/utils/underscore-to-space.pipe';

/**
 * Component for the dataset details page
 */
@Component({
  selector: 'app-dataset-details-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    UnderscoreToSpace,
    MatTabsModule,
    MatTableModule,
    MatExpansionModule,
    AddPluralS,
    MatSortModule,
  ],
  templateUrl: './dataset-details-page.component.html',
  styleUrl: './dataset-details-page.component.scss',
})
export class DatasetDetailsPageComponent implements OnInit {
  id = input.required<string>();
  #notify = inject(NotificationService);
  #metadata = inject(MetadataService);

  details = this.#metadata.datasetDetails;
  dap = computed(() => this.details().data_access_policy);
  dac = computed(() => this.dap().data_access_committee);
  study = computed(() => this.details().study);
  publications = computed(() => this.study().publications);
  files = computed(() =>
    [
      this.details().process_data_files,
      this.details().experiment_method_supporting_files,
      this.details().analysis_method_supporting_files,
      this.details().individual_supporting_files,
      this.details().research_data_files,
    ].flatMap((x) => x),
  );
  experiments = computed(() => this.details().experiments);
  samples = computed(() => this.details().samples);

  ngOnInit(): void {
    this.#metadata.loadDatasetDetailsID(this.id());
  }

  location: Location;
  constructor(location: Location) {
    this.location = location;
  }
  goBack() {
    this.location.historyGo(-1);
  }

  #errorEffect = effect(() => {
    if (this.#metadata.datasetDetailsError()) {
      this.#notify.showError('Error fetching dataset details.');
    }
  });

  // TODO: implement sorting and pagination via MatDataSource using signals
  experimentsColumns: string[] = [
    'accession',
    'ega_accession',
    'title',
    'description',
    'method',
    'platform',
  ];
  samplesColumns: string[] = [
    'accession',
    'ega_accession',
    'description',
    'status',
    'sex',
    'phenotype',
    'biospecimen_type',
    'tissue',
  ];
  filesColumns: string[] = [
    'accession',
    'ega_accession',
    'name',
    'type',
    'origin',
    'size',
    'location',
    'hash',
  ];
}

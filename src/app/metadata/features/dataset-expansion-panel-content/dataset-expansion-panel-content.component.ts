/**
 * Component for the individual expansion panels'content for the metadata browser
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Hit } from '@app/metadata/models/search-results';
import { MetadataService } from '@app/metadata/services/metadata.service';
import { AddPluralS } from '@app/shared/utils/add-plural-s.pipe';
import { UnderscoreToSpace } from '@app/shared/utils/underscore-to-space.pipe';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

/**
 * Component for the content of the expansion panel for each dataset found in the search results
 */
@Component({
  selector: 'app-dataset-expansion-panel-content',
  imports: [
    MatExpansionModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    UnderscoreToSpace,
    AddPluralS,
    RouterLink,
  ],
  templateUrl: './dataset-expansion-panel-content.component.html',
  styleUrl: './dataset-expansion-panel-content.component.scss',
})
export class DatasetExpansionPanelContentComponent {
  #metadata = inject(MetadataService);

  hit = input.required<Hit>();
  hitContent = computed(() => this.hit().content);

  summary = this.#metadata.datasetSummary;
  studiesSummary = computed(() => this.summary().studies_summary);
  studiesSummaryStats = computed(() => this.studiesSummary().stats);
  samplesSummary = computed(() => this.summary().samples_summary);
  samplesSex = computed(() => this.samplesSummary().stats.sex);
  samplesTissues = computed(() => this.samplesSummary().stats.tissues);
  samplesPhenotypes = computed(() => this.samplesSummary().stats.phenotypic_features);
  filesSummary = computed(() => this.summary().files_summary);
  filesFormats = computed(() => this.filesSummary().stats.format);
  experimentsSummary = computed(() => this.summary().experiments_summary);
  experimentsPlatforms = computed(
    () => this.experimentsSummary().stats.experiment_methods,
  );
}

/**
 * A skeleton for the Expansion Panel Content Component which is used as a loading state
 */
@Component({
  selector: 'app-dataset-expansion-panel-content-skeleton',
  imports: [NgxSkeletonLoaderModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './dataset-expansion-panel-content.skeleton.component.html',
  styleUrl: './dataset-expansion-panel-content.component.scss',
})
export class DatasetExpansionPanelContentSkeletonComponent {}

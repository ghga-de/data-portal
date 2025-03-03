/**
 * A stencil component for dataset summaries in the metadata browser
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { UnderscoreToSpace } from '@app/shared/utils/underscore-to-space.pipe';

/**
 * A stencil component for dataset summaries used as a loading state
 */
@Component({
  selector: 'app-dataset-summary-badges',
  imports: [MatChipsModule, UnderscoreToSpace],
  templateUrl: './dataset-summary.badges.component.html',
  styleUrl: './dataset-summary.badges.component.scss',
})
export class DatasetSummaryBadgesComponent {
  data = input.required<
    {
      value: string;
      count: number;
    }[]
  >();
}

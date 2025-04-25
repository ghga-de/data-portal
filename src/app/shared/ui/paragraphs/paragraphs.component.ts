/**
 * Component for generating paragraphs by splitting lines of text
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, input } from '@angular/core';
import { SplitLinesPipe } from '@app/shared/pipes/split-lines.pipe';

/**
 * Component for generating paragraphs by splitting lines of text
 */
@Component({
  selector: 'app-paragraphs',
  imports: [SplitLinesPipe],
  templateUrl: './paragraphs.component.html',
})
export class ParagraphsComponent {
  text = input.required<string>();
  header = input<string>();
  pClasses = input<string>();
}

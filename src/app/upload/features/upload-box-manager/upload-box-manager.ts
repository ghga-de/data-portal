/**
 * Component that hosts the Upload Box Manager feature.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Upload Box Manager component.
 *
 * This component is the data steward entry point for upload box management.
 */
@Component({
  selector: 'app-upload-box-manager',
  templateUrl: './upload-box-manager.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadBoxManagerComponent {}

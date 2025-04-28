/**
 * Well-Known Value Service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from '@app/shared/services/config.service';
import {
  emptyHumanReadableStorageAliases,
  HumanReadableStorageAliases,
} from '../models/storage-aliases';

/**
 * Well-Known Value query service
 *
 * This service provides the functionality to fetch well-known values.
 */
@Injectable({ providedIn: 'root' })
export class WellKnownValueService {
  #config = inject(ConfigService);
  #wkvsUrl = this.#config.wkvsUrl;

  #humanReadableStorageAliasesUrl = `${this.#wkvsUrl}/alias_decodes`;

  /**
   * The human-readable storage aliases (empty while loading) as a resource
   */
  humanReadableStorageAliases = httpResource<HumanReadableStorageAliases>(
    this.#humanReadableStorageAliasesUrl,
    {
      parse: (raw) =>
        (raw as { alias_decodes: HumanReadableStorageAliases }).alias_decodes,
      defaultValue: emptyHumanReadableStorageAliases,
    },
  ).asReadonly();
}

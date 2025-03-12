/**
 * Short module description
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

/**
 * This service manages a global Umami tracker instance.
 */
@Injectable({
  providedIn: 'root',
})
export class UmamiService {
  #config = inject(ConfigService);
  private serverUrl = this.#config.umami_url;
  private websiteId = this.#config.umami_website_id;

  constructor() {
    this.initializeUmami();
  }

  /**
   * This method initializes the Umami tracker by creating a script tag and adding it to the dom.
   */
  private initializeUmami() {
    const script = document.createElement('script');
    script.src = `${this.serverUrl}/umami.js`;
    script.setAttribute('data-website-id', this.websiteId);
    document.head.appendChild(script);
  }
}

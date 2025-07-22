/**
 * User management service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from '@app/shared/services/config.service';
import { RegisteredUser } from '../models/user';

/**
 * Service for managing users in the GHGA Data Portal.
 * This service handles fetching and managing user data for data stewards.
 */
@Injectable()
export class UserService {
  #config = inject(ConfigService);

  #authUrl = this.#config.authUrl;
  #usersUrl = `${this.#authUrl}/users`;

  /**
   * Resource for loading all users.
   * Automatically loads when the service is instantiated.
   * Note: We do the filtering currently only on the client side,
   * but in principle we can also do some filtering on the server.
   */
  allUsers = httpResource<RegisteredUser[]>(() => this.#usersUrl, {
    defaultValue: [],
  });
}

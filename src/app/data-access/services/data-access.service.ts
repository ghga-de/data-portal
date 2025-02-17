/**
 * The Data Access service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@app/auth/services/auth.service';
import { ConfigService } from '@app/shared/services/config.service';
import { map } from 'rxjs';
// eslint-disable-next-line boundaries/element-types
import { DataAccessRequestModalComponent } from '../features/data-access-request-modal/data-access-request-modal.component';
import { AccessRequest } from '../models/access-requests';

/**
 *  This service handles state and management of access requests (to datasets)
 */
@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  #http = inject(HttpClient);
  #auth = inject(AuthService);
  #dialog = inject(MatDialog);
  #userId = computed<string | null>(() => this.#auth.user()?.id || null);
  #config = inject(ConfigService);
  #arsBaseUrl = this.#config.arsUrl;
  #arsEndpointUrl = `${this.#arsBaseUrl}/access-requests`;
  constructor() {}

  showNewAccessRequestDialog = (id: string) => {
    this.#dialog.open(DataAccessRequestModalComponent, {
      id,
      height: '400px',
      width: '600px',
    });
    this.#dialog.afterAllClosed.subscribe((event) => {
      console.log(event);
    });
  };

  #accessRequests = rxResource<AccessRequest[], string | null>({
    request: this.#userId,
    loader: ({ request: userId }) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return this.#http
        .get<AccessRequest[]>(`${this.#arsEndpointUrl}?user_id=${userId}`)
        .pipe(
          map((ar) =>
            ar.filter(({ status }) => status === 'pending' || status === 'allowed'),
          ),
        );
    },
  }).asReadonly();

  accessRequests: Signal<AccessRequest[]> = computed(
    () => this.#accessRequests.value() ?? [],
  );
  grantedAccessRequests = computed(() =>
    this.accessRequests().filter((ar: AccessRequest) => ar.status == 'allowed'),
  );

  pendingAccessRequests = computed(() =>
    this.accessRequests().filter((ar: AccessRequest) => ar.status == 'pending'),
  );

  isLoading = this.#accessRequests.isLoading;
}

/**
 * Mock for the Data Access Service
 */
export class MockDataAccessService {
  isLoading = signal(false);

  grantedAccessRequests = signal([
    {
      id: 'GHGAD15111403130971',
      user_id: '',
      dataset_id: 'GHGAD588887987',
      full_user_name: 'aacaffeecaffeecaffeecaffeecaffeecaffeeaad@lifescience-ri.eu',
      email: 'aacaffeecaffeecaffeecaffeecaffeecaffeeaad@lifescience-ri.eu',
      request_text: 'unit test request',
      access_starts: Date.now().toString(),
      access_ends: Date.now().toString(),
      request_created: Date.now().toString(),
      status: 'approved',
      status_changed: '',
      changed_by: '',
      iva_id: '',
    },
  ]);

  pendingAccessRequests = signal([
    {
      id: 'GHGAD15111403130971',
      user_id: '',
      dataset_id: 'GHGAD588887987',
      full_user_name: 'aacaffeecaffeecaffeecaffeecaffeecaffeeaad@lifescience-ri.eu',
      email: 'aacaffeecaffeecaffeecaffeecaffeecaffeeaad@lifescience-ri.eu',
      request_text: 'unit test request',
      access_starts: Date.now().toString(),
      access_ends: Date.now().toString(),
      request_created: Date.now().toString(),
      status: 'pending',
      status_changed: '',
      changed_by: '',
      iva_id: '',
    },
  ]);
}

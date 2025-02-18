/**
 * The Data Access service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '@app/auth/services/auth.service';
import { ConfigService } from '@app/shared/services/config.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { catchError, firstValueFrom, map } from 'rxjs';
// eslint-disable-next-line boundaries/element-types
import { DataAccessRequestModalComponent } from '../features/data-access-request-modal/data-access-request-modal.component';
import { AccessRequest, AccessRequestDialogData } from '../models/access-requests';

/**
 *  This service handles state and management of access requests (to datasets)
 */
@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  #dialogRef: MatDialogRef<DataAccessRequestModalComponent> | undefined;
  #http = inject(HttpClient);
  #auth = inject(AuthService);
  #notification = inject(NotificationService);
  #dialog = inject(MatDialog);
  #userId = computed<string | null>(() => this.#auth.user()?.id || null);
  #config = inject(ConfigService);
  #arsBaseUrl = this.#config.arsUrl;
  #arsEndpointUrl = `${this.#arsBaseUrl}/access-requests`;

  showNewAccessRequestDialog = (id: string) => {
    if (!this.#auth.isAuthenticated()) {
      this.#notification.showError('You must be logged in to perform this action');
      return;
    }

    const data: AccessRequestDialogData = {
      datasetID: id,
      email: '',
      description: '',
      fromDate: undefined,
      untilDate: undefined,
      isCanceled: false,
      userId: '',
    };

    this.#dialogRef = this.#dialog.open(DataAccessRequestModalComponent, {
      data,
    });

    this.#dialogRef
      .afterClosed()
      .subscribe((componentData) => this.#processAccessRequest(componentData));
  };

  #processAccessRequest = (data: AccessRequestDialogData) => {
    const userid = this.#auth.user()?.id;
    if (data.isCanceled || !this.#auth.isAuthenticated() || !userid) {
      return;
    }
    data.userId = userid;
    this.#performAccessRequest(data);
  };

  #performAccessRequest = (data: AccessRequestDialogData) => {
    data.fromDate?.setUTCHours(0);
    data.fromDate?.setUTCMinutes(0);
    data.fromDate?.setUTCSeconds(0);
    data.fromDate?.setUTCMilliseconds(0);
    data.untilDate?.setHours(23);
    data.untilDate?.setMinutes(59);
    data.untilDate?.setSeconds(59);
    data.untilDate?.setMilliseconds(999);
    try {
      firstValueFrom(
        this.#http
          .post<void>(this.#arsEndpointUrl, {
            user_id: data.userId,
            dataset_id: data.datasetID,
            email: data.email,
            request_text: data.description,
            access_starts: data.fromDate?.toDateString(),
            access_ends: data.untilDate?.toDateString(),
          })
          .pipe(
            map(console.log),
            catchError(async () =>
              this.#notification.showError(
                'There was an error submitting your access request.',
              ),
            ),
          ),
      ).then(async () => {
        this.#accessRequests.reload();
        this.#notification.showSuccess('You have been logged out.');
      });
    } catch (error) {
      console.error(error);
    }
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

/**
 * Test the well known value service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ConfigService } from '@app/shared/services/config.service';
import { emptyStorageAliasDecodes } from '../models/storage-aliases';
import { WellKnownValueService } from './well-known.service';

import { storageAliasDecodes } from '@app/../mocks/data';

/**
 * Mock the config service as needed by the metadata service
 */
class MockConfigService {
  wkvsUrl = 'http://mock.dev/.well-known/values';
}

describe('WellKnownValueService', () => {
  let service: WellKnownValueService;
  let httpMock: HttpTestingController;
  let testBed: TestBed;

  beforeEach(() => {
    testBed = TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useClass: MockConfigService },
        { provide: WellKnownValueService },
      ],
    });
    service = TestBed.inject(WellKnownValueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the storage alias decodes', async () => {
    const decodes = service.storageAliasDecodes;
    expect(decodes.isLoading()).toBeTruthy();
    expect(decodes.error()).toBeUndefined();
    expect(decodes.value()).toEqual(emptyStorageAliasDecodes);
    testBed.flushEffects();
    const req = httpMock.expectOne(
      'http://mock.dev/.well-known/values/storage_alias_decodes',
    );
    expect(req.request.method).toBe('GET');
    req.flush(storageAliasDecodes);
    await Promise.resolve(); // wait for loader to return
    expect(decodes.isLoading()).toBe(false);
    expect(decodes.error()).toBeUndefined();
    expect(decodes.value()).toEqual(storageAliasDecodes.storage_alias_decodes);
  });
});

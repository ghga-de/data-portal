/**
 * Tests for the access request field editing service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '@app/shared/services/config.service';
import { AccessRequestFieldEditService } from './access-request-field-edit.service';

/**
 * Mock the config service as needed by the auth service
 */
class MockConfigService {
  authUrl = 'http://mock.dev/auth';
}

describe('AccessRequestFieldEditService', () => {
  let service: AccessRequestFieldEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useClass: MockConfigService },
      ],
    });
    service = TestBed.inject(AccessRequestFieldEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

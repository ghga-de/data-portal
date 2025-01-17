/**
 * Test the metadata service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigService } from '@app/shared/services/config.service';
import { GlobalSummaryService } from './globalSummary.service';

/**
 * Mock the config service as needed by the metadata service
 */
class MockConfigService {
  metldataURL = 'http://mock.dev/metldata';
}

describe('GlobalSummaryService', () => {
  let service: GlobalSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useClass: MockConfigService },
      ],
    });
    service = TestBed.inject(GlobalSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

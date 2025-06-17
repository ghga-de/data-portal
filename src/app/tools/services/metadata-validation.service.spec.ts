/**
 * Module containing the MetadataValidationService tests.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MetadataValidationService } from './metadata-validation.service';

describe('MetadataValidationService', () => {
  let service: MetadataValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), provideHttpClient()],
    });
    service = TestBed.inject(MetadataValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

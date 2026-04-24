/**
 * Test the metadata service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ConfigService } from '@app/shared/services/config';
import { firstValueFrom } from 'rxjs';
import { emptyDatasetDetails } from '../models/dataset-details';
import { emptyStudy, Study } from '../models/study';
import { MetadataService } from './metadata';

/**
 * Mock the config service as needed by the metadata service
 */
class MockConfigService {
  metldataUrl = 'http://mock.dev/metldata';
}

describe('MetadataService', () => {
  let service: MetadataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MetadataService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfigService, useClass: MockConfigService },
      ],
    });
    service = TestBed.inject(MetadataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty file map for studies without datasets', async () => {
    const study: Study = {
      ...emptyStudy,
      accession: 'STU1',
      datasets: [],
    };

    const fileMap = await firstValueFrom(service.fetchStudyFileMap(study));

    expect(fileMap.size).toBe(0);
  });

  it('should build a deduplicated file map from all *_files fields', async () => {
    const study: Study = {
      ...emptyStudy,
      accession: 'STU1',
      datasets: ['DS1', 'DS2'],
    };

    const fileMapPromise = firstValueFrom(service.fetchStudyFileMap(study));

    const ds1Req = httpMock.expectOne(
      'http://mock.dev/metldata/artifacts/embedded_public/classes/EmbeddedDataset/resources/DS1',
    );
    ds1Req.flush({
      ...emptyDatasetDetails,
      accession: 'DS1',
      process_data_files: [
        {
          accession: 'FILE-1',
          alias: 'ALIAS-1',
          format: 'BAM',
          name: 'first-file',
          ega_accession: 'EGA1',
          file_information: { accession: 'FILE-1', storage_alias: 'LOC-1' },
        },
      ],
      research_data_files: [
        {
          accession: 'FILE-2',
          alias: 'ALIAS-2',
          format: 'VCF',
          name: 'second-file',
          ega_accession: 'EGA2',
          file_information: { accession: 'FILE-2', storage_alias: 'LOC-2' },
        },
      ],
    });

    await Promise.resolve();

    const ds2Req = httpMock.expectOne(
      'http://mock.dev/metldata/artifacts/embedded_public/classes/EmbeddedDataset/resources/DS2',
    );
    ds2Req.flush({
      ...emptyDatasetDetails,
      accession: 'DS2',
      experiment_method_supporting_files: [
        {
          accession: 'FILE-3',
          format: 'CRAM',
          name: 'third-file',
          ega_accession: 'EGA3',
          file_information: { accession: 'FILE-3' },
        },
      ],
      individual_supporting_files: [
        {
          accession: 'FILE-1',
          alias: 'ALIAS-DUPE',
          format: 'FASTQ',
          name: 'duplicate-should-be-ignored',
          ega_accession: 'EGA4',
          file_information: { accession: 'FILE-1', storage_alias: 'LOC-DUPE' },
        },
      ],
    });

    const fileMap = await fileMapPromise;

    expect(fileMap.size).toBe(3);
    expect(fileMap.get('FILE-1')).toEqual({
      alias: 'ALIAS-1',
      name: 'first-file',
      format: 'BAM',
    });
    expect(fileMap.get('FILE-2')).toEqual({
      alias: 'ALIAS-2',
      name: 'second-file',
      format: 'VCF',
    });
    expect(fileMap.get('FILE-3')).toEqual({
      alias: '',
      name: 'third-file',
      format: 'CRAM',
    });
  });

  it('should reject when a dataset details request fails', async () => {
    const study: Study = {
      ...emptyStudy,
      accession: 'STU1',
      datasets: ['DS1'],
    };

    const fileMapPromise = firstValueFrom(service.fetchStudyFileMap(study));

    const req = httpMock.expectOne(
      'http://mock.dev/metldata/artifacts/embedded_public/classes/EmbeddedDataset/resources/DS1',
    );
    req.flush({ detail: 'failed' }, { status: 500, statusText: 'Server Error' });

    await expect(fileMapPromise).rejects.toBeDefined();
  });
});

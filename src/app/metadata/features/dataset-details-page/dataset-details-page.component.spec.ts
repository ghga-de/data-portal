/**
 * Short module description
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';
import { datasetDetails } from '@app/../mocks/data';
import { MetadataService } from '@app/metadata/services/metadata.service';
import { DatasetDetailsPageComponent } from './dataset-details-page.component';

/**
 * Mock the metadata service as needed for the dataset details
 */
class MockMetadataService {
  details = signal(datasetDetails);
  detailsError = signal(undefined);
  loadDatasetDetailsID = () => undefined;
}

describe('DatasetDetailsPageComponent', () => {
  let component: DatasetDetailsPageComponent;
  let fixture: ComponentFixture<DatasetDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetDetailsPageComponent],
      providers: [{ provide: MetadataService, useClass: MockMetadataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', datasetDetails.accession);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent;
    expect(text).toContain('SYNTHETIC GENOMICS');
    expect(text).toContain('An interesting dataset A of complete example set');
  });
});

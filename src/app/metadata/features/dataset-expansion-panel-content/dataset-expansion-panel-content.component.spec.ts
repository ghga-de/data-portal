/**
 * Test the dataset expansion panel
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { datasetSummary, searchResults } from '@app/../mocks/data';
import { MetadataService } from '@app/metadata/services/metadata.service';
import { DatasetExpansionPanelContentComponent } from './dataset-expansion-panel-content.component';

/**
 * Mock the metadata service as needed for the dataset summary
 */
class MockMetadataService {
  datasetSummary = signal(datasetSummary);
  datasetSummaryError = signal(undefined);
}

describe('DatasetExpansionPanelContentComponent', () => {
  let component: DatasetExpansionPanelContentComponent;
  let fixture: ComponentFixture<DatasetExpansionPanelContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetExpansionPanelContentComponent],
      providers: [
        { provide: MetadataService, useClass: MockMetadataService },
        RouterModule,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetExpansionPanelContentComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('hit', searchResults.hits.at(0));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show datasets', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent;
    expect(text).toContain('GHGAD588887987');
    expect(text).toContain('Test dataset for details');
  });
});

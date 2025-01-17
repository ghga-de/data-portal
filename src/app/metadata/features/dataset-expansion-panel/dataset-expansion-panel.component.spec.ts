/**
 * Test the dataset expansion panel
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';
import { datasetSummary } from '@app/../mocks/data';
import { DatasetSummaryService } from '@app/metadata/services/datasetSummary.service';
import { DatasetExpansionPanelComponent } from './dataset-expansion-panel.component';

/**
 * Mock the metadata service as needed for the global stats
 */
class MockDatasetSummaryService {
  globalSummary = signal(datasetSummary);
  globalSummaryError = signal(undefined);
}
describe('DatasetExpansionPanelComponent', () => {
  let component: DatasetExpansionPanelComponent;
  let fixture: ComponentFixture<DatasetExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetExpansionPanelComponent],
      providers: [
        { provide: DatasetSummaryService, useClass: MockDatasetSummaryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetExpansionPanelComponent);
    component = fixture.componentInstance;
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

/**
 * Test the Upload Box Manager List component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
// eslint-disable-next-line boundaries/element-types
import { uploadBoxes } from '@app/../mocks/data';
import { UploadBoxService } from '@app/upload/services/upload-box';
import { UploadBoxManagerListComponent } from './upload-box-manager-list';

/**
 * Mock the upload box service as needed by the upload box manager list component.
 */
class MockUploadBoxService {
  boxRetrievalResults = {
    value: () => uploadBoxes,
    isLoading: () => false,
    error: () => undefined,
  };
  filteredUploadBoxes = () => this.boxRetrievalResults.value().boxes;
}

describe('UploadBoxManagerListComponent', () => {
  let component: UploadBoxManagerListComponent;
  let fixture: ComponentFixture<UploadBoxManagerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBoxManagerListComponent],
      providers: [{ provide: UploadBoxService, useClass: MockUploadBoxService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBoxManagerListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show upload box titles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent;
    expect(text).toContain('Upload Box of John');
  });
});

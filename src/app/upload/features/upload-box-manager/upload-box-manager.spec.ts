/**
 * Test the Upload Box Manager component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadBoxService } from '@app/upload/services/upload-box';
import { screen } from '@testing-library/angular';
import { UploadBoxManagerComponent } from './upload-box-manager';

/**
 * Mock the upload box service as needed by the upload box manager component.
 */
class MockUploadBoxService {
  boxRetrievalResults = {
    value: () => ({ count: 0, boxes: [] }),
    isLoading: () => false,
    error: () => undefined,
  };
  uploadBoxesFilter = () => ({
    title: undefined,
    state: undefined,
    location: undefined,
  });
  uploadBoxLocations = () => [];
  filteredUploadBoxes = () => [];
  loadAllUploadBoxes = vitest.fn();
  setUploadBoxesFilter = vitest.fn();
}

describe('UploadBoxManagerComponent', () => {
  let component: UploadBoxManagerComponent;
  let fixture: ComponentFixture<UploadBoxManagerComponent>;
  let uploadBoxService: UploadBoxService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBoxManagerComponent],
      providers: [{ provide: UploadBoxService, useClass: MockUploadBoxService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBoxManagerComponent);
    uploadBoxService = TestBed.inject(UploadBoxService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the proper heading', () => {
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Upload Box Manager');
  });

  it('should load all upload boxes upon initialization', () => {
    expect(uploadBoxService.loadAllUploadBoxes).toHaveBeenCalled();
  });
});

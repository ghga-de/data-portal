/**
 * Test the Upload Box Manager Filter component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadBoxState } from '@app/upload/models/box';
import { UploadBoxService } from '@app/upload/services/upload-box';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { UploadBoxManagerFilterComponent } from './upload-box-manager-filter';

/**
 * Mock the upload box service as needed by the upload box manager filter component.
 */
const mockUploadBoxService = {
  uploadBoxesFilter: () => ({
    title: undefined,
    state: undefined,
    location: undefined,
  }),
  uploadBoxLocations: () => ['HD02', 'TUE01'],
  setUploadBoxesFilter: vitest.fn(),
};

describe('UploadBoxManagerFilterComponent', () => {
  let component: UploadBoxManagerFilterComponent;
  let fixture: ComponentFixture<UploadBoxManagerFilterComponent>;
  let uploadBoxService: UploadBoxService;

  beforeEach(async () => {
    mockUploadBoxService.setUploadBoxesFilter.mockClear();
    await TestBed.configureTestingModule({
      imports: [UploadBoxManagerFilterComponent],
      providers: [{ provide: UploadBoxService, useValue: mockUploadBoxService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBoxManagerFilterComponent);
    component = fixture.componentInstance;
    uploadBoxService = TestBed.inject(UploadBoxService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the filter upon initialization', async () => {
    expect(uploadBoxService.setUploadBoxesFilter).toHaveBeenCalledWith({
      title: undefined,
      state: undefined,
      location: undefined,
    });
  });

  it('should set the filter after typing a title', async () => {
    const textbox = screen.getByRole('textbox', { name: 'Upload box title' });

    await userEvent.type(textbox, 'Upload Box');
    await fixture.whenStable();

    expect(uploadBoxService.setUploadBoxesFilter).toHaveBeenCalledWith({
      title: 'Upload Box',
      state: undefined,
      location: undefined,
    });
  });

  it('should set the filter after selecting a state', async () => {
    const combobox = screen.getByRole('combobox', { name: 'All states' });

    await userEvent.click(combobox);
    await fixture.whenStable();

    const option = screen.getByRole('option', { name: 'Open' });
    await userEvent.click(option);
    await fixture.whenStable();

    expect(uploadBoxService.setUploadBoxesFilter).toHaveBeenCalledWith({
      title: undefined,
      state: UploadBoxState.open,
      location: undefined,
    });
  });

  it('should set the filter after selecting a location', async () => {
    const combobox = screen.getByRole('combobox', { name: 'All locations' });

    await userEvent.click(combobox);
    await fixture.whenStable();

    const option = screen.getByRole('option', { name: 'HD02' });
    await userEvent.click(option);
    await fixture.whenStable();

    expect(uploadBoxService.setUploadBoxesFilter).toHaveBeenCalledWith({
      title: undefined,
      state: undefined,
      location: 'HD02',
    });
  });
});

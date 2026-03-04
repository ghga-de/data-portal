/**
 * Test the Upload Box Manager Filter component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadBoxManagerFilterComponent } from './upload-box-manager-filter';

describe('UploadBoxManagerFilterComponent', () => {
  let component: UploadBoxManagerFilterComponent;
  let fixture: ComponentFixture<UploadBoxManagerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBoxManagerFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBoxManagerFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

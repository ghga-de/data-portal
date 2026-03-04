/**
 * Test the Upload Box Manager component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadBoxManagerComponent } from './upload-box-manager';

describe('UploadBoxManagerComponent', () => {
  let component: UploadBoxManagerComponent;
  let fixture: ComponentFixture<UploadBoxManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBoxManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBoxManagerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

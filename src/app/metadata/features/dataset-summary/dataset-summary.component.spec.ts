/**
 * Test the dataset summary component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSummaryComponent } from './dataset-summary.component';

describe('DatasetSummaryComponent', () => {
  let component: DatasetSummaryComponent;
  let fixture: ComponentFixture<DatasetSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetSummaryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

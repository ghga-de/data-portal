/**
 * Test the dataset expansion panel
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetExpansionPanelComponent } from './dataset-expansion-panel.component';

describe('DatasetExpansionPanelComponent', () => {
  let component: DatasetExpansionPanelComponent;
  let fixture: ComponentFixture<DatasetExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetExpansionPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

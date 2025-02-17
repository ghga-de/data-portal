/**
 * Tests for the Content of the data access request modal.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNativeDateAdapter } from '@angular/material/core';
import { DataAccessRequestModalComponent } from './data-access-request-modal.component';

describe('DataAccessRequestModalComponent', () => {
  let component: DataAccessRequestModalComponent;
  let fixture: ComponentFixture<DataAccessRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataAccessRequestModalComponent],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(DataAccessRequestModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('datasetID', 'GHGAD588887987');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

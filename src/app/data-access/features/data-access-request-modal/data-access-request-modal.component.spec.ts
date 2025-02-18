/**
 * Tests for the Content of the data access request modal.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DataAccessRequestModalComponent } from './data-access-request-modal.component';

describe('DataAccessRequestModalComponent', () => {
  let component: DataAccessRequestModalComponent;
  let fixture: ComponentFixture<DataAccessRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataAccessRequestModalComponent, MatDialogModule],
      providers: [
        provideNativeDateAdapter(),
        {
          provide: MatDialogRef,
          useValue: {},
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        provideAnimationsAsync(),
      ],
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

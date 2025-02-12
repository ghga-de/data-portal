/**
 *  Test the IVA creation dialog component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIvaDialogComponent } from './new-iva-dialog.component';

describe('NewIvaDialogComponent', () => {
  let component: NewIvaDialogComponent;
  let fixture: ComponentFixture<NewIvaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewIvaDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewIvaDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

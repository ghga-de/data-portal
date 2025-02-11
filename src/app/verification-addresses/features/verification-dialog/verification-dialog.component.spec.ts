/**
 * Test the IVA verification dialog component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationDialogComponent } from './verification-dialog.component';

describe('VerificationDialogComponent', () => {
  let component: VerificationDialogComponent;
  let fixture: ComponentFixture<VerificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

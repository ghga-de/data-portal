/**
 * Test the verification code creation dialog
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeCreationDialogComponent } from './code-creation-dialog.component';

describe('CodeCreationDialogComponent', () => {
  let component: CodeCreationDialogComponent;
  let fixture: ComponentFixture<CodeCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeCreationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeCreationDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

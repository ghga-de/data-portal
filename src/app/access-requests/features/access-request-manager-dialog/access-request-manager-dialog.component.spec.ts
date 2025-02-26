/**
 * Test the dialog component used in the access request manager.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestManagerDialogComponent } from './access-request-manager-dialog.component';

describe('AccessRequestManagerDialogComponent', () => {
  let component: AccessRequestManagerDialogComponent;
  let fixture: ComponentFixture<AccessRequestManagerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRequestManagerDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessRequestManagerDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

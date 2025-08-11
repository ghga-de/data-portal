/**
 * Unit tests for the button to revoke access grants
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockAccessRequestService } from '@app/access-requests/services/access-request.mock-service';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';
import { AccessGrantRevocationDialogComponent } from './access-grant-revocation-dialog.component';

describe('DynamicAccessRequestDialogComponent', () => {
  let component: AccessGrantRevocationDialogComponent;
  let fixture: ComponentFixture<AccessGrantRevocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessGrantRevocationDialogComponent],
      providers: [
        { provide: AccessRequestService, useClass: MockAccessRequestService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessGrantRevocationDialogComponent);
    fixture.componentRef.setInput('grantID', 'GHGAD12345678901236');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

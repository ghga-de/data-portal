/**
 * Test the Access Grant Manager Details component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';
import { AccessGrantManagerDetailsComponent } from './access-grant-manager-details.component';

/**
 * Mock the access request service as needed by the access grant filter component
 */
const mockAccessRequestService = {};

describe('AccessGrantManagerDetailsComponent', () => {
  let component: AccessGrantManagerDetailsComponent;
  let fixture: ComponentFixture<AccessGrantManagerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessGrantManagerDetailsComponent],
      providers: [
        { provide: AccessRequestService, useValue: mockAccessRequestService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessGrantManagerDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

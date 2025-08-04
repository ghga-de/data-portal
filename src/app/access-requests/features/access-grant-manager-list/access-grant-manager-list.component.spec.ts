/**
 * Test the Access Grant Manager List component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { accessGrants } from '@app/../mocks/data';
import { AccessRequestService } from '@app/access-requests/services/access-request.service';
import { AccessGrantManagerListComponent } from './access-grant-manager-list.component';

/**
 * Mock the access request service as needed by the access grant manager list
 */
const mockAccessRequestService = {
  allAccessGrants: {
    value: () => accessGrants,
    isLoading: () => false,
    error: () => undefined,
  },
  allAccessGrantsFiltered: () => accessGrants,
};

describe('AccessGrantManagerListComponent', () => {
  let component: AccessGrantManagerListComponent;
  let fixture: ComponentFixture<AccessGrantManagerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: AccessRequestService, useValue: mockAccessRequestService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessGrantManagerListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

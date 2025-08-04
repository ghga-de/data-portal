/**
 * Test the Access Grant Manager Filter component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestService } from '@app/access-requests/services/access-request.service';
import { AccessGrantManagerFilterComponent } from './access-grant-manager-filter.component';

/**
 * Mock the access request service as needed by the access grant filter component
 */
const mockAccessRequestService = {
  allAccessGrantsFilter: () => ({
    status: undefined,
    name: undefined,
    email: undefined,
    dataset_id: undefined,
    grant_id: undefined,
  }),
  setAllAccessGrantsFilter: jest.fn(),
};

describe('AccessGrantManagerFilterComponent', () => {
  let component: AccessGrantManagerFilterComponent;
  let fixture: ComponentFixture<AccessGrantManagerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessGrantManagerFilterComponent],
      providers: [
        { provide: AccessRequestService, useValue: mockAccessRequestService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessGrantManagerFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

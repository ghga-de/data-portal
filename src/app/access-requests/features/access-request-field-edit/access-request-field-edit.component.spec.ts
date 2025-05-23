/**
 * Test the Access Request Field Editor component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestFieldEditComponent } from './access-request-field-edit.component';

import { accessRequests } from '@app/../mocks/data';

/**
 * Mock the config service as needed by the access request note component
 */
class MockConfigService {
  helpdeskTicketUrl = 'http:/helpdesk.test/ticket/';
}

describe('AccessRequestFieldComponent', () => {
  let component: AccessRequestFieldEditComponent;
  let fixture: ComponentFixture<AccessRequestFieldEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRequestFieldEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessRequestFieldEditComponent);
    fixture.componentRef.setInput('request', accessRequests[0]);
    fixture.componentRef.setInput('editNoteToRequester', {
      name: 'note_to_requester',
      show: false,
      editedValue: null,
    });
    fixture.componentRef.setInput('editInternalNote', {
      name: 'internal_note',
      show: false,
      editedValue: null,
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

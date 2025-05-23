/**
 * Test the Access Request Note component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestNotesEditComponent } from './access-request-notes-edit.component';

import { accessRequests } from '@app/../mocks/data';
import {
  AccessRequestService,
  MockAccessRequestService,
} from '@app/access-requests/services/access-request.service';
import { ConfigService } from '@app/shared/services/config.service';

/**
 * Mock the config service as needed by the access request note component
 */
class MockConfigService {
  helpdeskTicketUrl = 'http:/helpdesk.test/ticket/';
}

describe('AccessRequestNoteComponent', () => {
  let component: AccessRequestNotesEditComponent;
  let fixture: ComponentFixture<AccessRequestNotesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRequestNotesEditComponent],
      providers: [
        { provide: AccessRequestService, useClass: MockAccessRequestService },
        { provide: ConfigService, useClass: MockConfigService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessRequestNotesEditComponent);
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

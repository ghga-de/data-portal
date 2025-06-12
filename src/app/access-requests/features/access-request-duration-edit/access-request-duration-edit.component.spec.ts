/**
 * Test the Access Request Duration Editor component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestDurationEditComponent } from './access-request-duration-edit.component';

import { accessRequests } from '@app/../mocks/data';
import { ConfigService } from '@app/shared/services/config.service';

/**
 * Mock the config service as needed by the access request duration edit component
 */
class MockConfigService {
  helpdeskTicketUrl = 'http:/helpdesk.test/ticket/';
}

describe('AccessRequestDurationComponent', () => {
  let component: AccessRequestDurationEditComponent;
  let fixture: ComponentFixture<AccessRequestDurationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ConfigService, useClass: MockConfigService }],
      imports: [AccessRequestDurationEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessRequestDurationEditComponent);
    fixture.componentRef.setInput('request', accessRequests[0]);
    fixture.componentRef.setInput('name', 'internal_note');
    fixture.componentRef.setInput('label', 'Internal Note');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

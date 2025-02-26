/**
 * Unit tests for the dynamic access request button
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DataAccessService,
  MockDataAccessService,
} from '@app/access-requests/services/data-access.service';
import { AuthService } from '@app/auth/services/auth.service';
import { DynamicAccessRequestButtonComponent } from './dynamic-access-request-button.component';

/**
 * Mock a basic version of the auth service
 */
export class MockAuthService {
  fullName = () => 'Dr. John Doe';
  email = () => 'doe@home.org';
  role = () => 'data_steward';
  roleName = () => 'Data Steward';
}

describe('DynamicAccessRequestButtonComponent', () => {
  let component: DynamicAccessRequestButtonComponent;
  let fixture: ComponentFixture<DynamicAccessRequestButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicAccessRequestButtonComponent],
      providers: [
        { provide: DataAccessService, useClass: MockDataAccessService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicAccessRequestButtonComponent);
    fixture.componentRef.setInput('datasetID', 'GHGAD588887987');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

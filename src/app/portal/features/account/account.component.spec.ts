/**
 * Unit tests for the account page
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { fakeActivatedRoute } from '@app/../mocks/route';
import {
  DataAccessService,
  MockDataAccessService,
} from '@app/access-requests/services/data-access.service';
import { AuthService } from '@app/auth/services/auth.service';
import { AccountComponent } from './account.component';

/**
 * Mock the auth service as needed for the account component
 */
class MockAuthService {
  fullName = () => 'Dr. John Doe';
  email = () => 'doe@home.org';
  role = () => 'data_steward';
  roleName = () => 'Data Steward';
}

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: DataAccessService, useClass: MockDataAccessService },
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

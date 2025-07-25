/**
 * Test the User Manager Filter component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerFilterComponent } from './user-manager-filter.component';

import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { UserStatus } from '@app/auth/models/user';
import { UserService } from '@app/auth/services/user.service';
import { ConfigService } from '@app/shared/services/config.service';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

/**
 * Mock the user service as needed by the user manager filter component
 */
const mockUserService = {
  allUsersFilter: () => ({
    name: '',
    role: undefined,
    status: undefined,
    fromDate: undefined,
    toDate: undefined,
  }),
  setAllUsersFilter: jest.fn(),
};

/**
 * Mock ConfigService for testing
 */
class MockConfigService {
  auth_url = 'https://test-auth.example.com';
}

describe('UserManagerFilterComponent', () => {
  let component: UserManagerFilterComponent;
  let fixture: ComponentFixture<UserManagerFilterComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagerFilterComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ConfigService, useClass: MockConfigService },
        provideHttpClient(),
        provideNativeDateAdapter(),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagerFilterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the filter upon initialization', async () => {
    expect(userService.setAllUsersFilter).toHaveBeenCalledWith({
      name: '',
      roles: undefined,
      status: undefined,
      fromDate: undefined,
      toDate: undefined,
    });
  });

  it('should set the filter after typing a name', async () => {
    const textbox = screen.getByRole('textbox', { name: 'Name of user' });

    await userEvent.type(textbox, 'Doe');
    await fixture.whenStable();

    expect(userService.setAllUsersFilter).toHaveBeenCalledWith({
      name: 'Doe',
      roles: undefined,
      status: undefined,
      fromDate: undefined,
      toDate: undefined,
    });
  });

  it('should set the filter after selecting a state', async () => {
    const combobox = screen.getByRole('combobox', { name: 'All status values' });

    await userEvent.click(combobox);
    await fixture.whenStable();

    const option = screen.getByRole('option', { name: 'Active' });
    await userEvent.click(option);
    await fixture.whenStable();

    expect(userService.setAllUsersFilter).toHaveBeenCalledWith({
      name: '',
      roles: undefined,
      status: UserStatus.active,
      fromDate: undefined,
      untilDate: undefined,
    });
  });
});

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
  usersFilter: () => ({
    idStrings: '',
    role: undefined,
    status: undefined,
    fromDate: undefined,
    toDate: undefined,
  }),
  setUsersFilter: jest.fn(),
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
    expect(userService.setUsersFilter).toHaveBeenCalledWith({
      idStrings: '',
      roles: undefined,
      status: undefined,
      fromDate: undefined,
      toDate: undefined,
    });
  });

  it('should set the filter after typing a name', async () => {
    const textbox = screen.getByRole('textbox', {
      name: 'Name, email, or LS ID of user',
    });

    await userEvent.type(textbox, 'Doe');
    await fixture.whenStable();

    expect(userService.setUsersFilter).toHaveBeenCalledWith({
      idStrings: 'Doe',
      roles: undefined,
      status: undefined,
      fromDate: undefined,
      toDate: undefined,
    });
  });

  it('should set the filter after choosing a role', async () => {
    const select = screen.getByRole('combobox', {
      name: 'Any role',
    });

    await userEvent.click(select);
    const dataSteward = screen.getByRole('option', { name: 'Data Steward' });
    await userEvent.click(dataSteward);
    await fixture.whenStable();

    expect(userService.setUsersFilter).toHaveBeenCalledWith({
      idStrings: '',
      roles: ['data_steward'],
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

    expect(userService.setUsersFilter).toHaveBeenCalledWith({
      idStrings: '',
      roles: undefined,
      status: UserStatus.active,
      fromDate: undefined,
      untilDate: undefined,
    });
  });

  it('should set the filter after typing a from date', async () => {
    const textbox = screen.getByRole('textbox', {
      name: 'Registration date from',
    });

    await userEvent.type(textbox, '2024-09-01');
    await fixture.whenStable();

    expect(userService.setUsersFilter).toHaveBeenCalledWith({
      idStrings: '',
      roles: undefined,
      status: undefined,
      fromDate: '2024-09-01T00:00:00.000Z',
      toDate: undefined,
    });
  });

  it('should set the filter after typing an until date', async () => {
    const textbox = screen.getByRole('textbox', {
      name: 'Registration date until',
    });

    await userEvent.type(textbox, '2022-06-01');
    await fixture.whenStable();

    expect(userService.setUsersFilter).toHaveBeenCalledWith({
      idStrings: '',
      roles: undefined,
      status: undefined,
      fromDate: undefined,
      toDate: '2022-06-01T00:00:00.000Z',
    });
  });
});

/**
 * User Manager List component tests
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '@app/auth/services/user.service';
import { UserManagerListComponent } from './user-manager-list.component';

/**
 * Mock UserService for testing
 */
class MockUserService {
  users = {
    value: jest.fn(() => []),
    isLoading: jest.fn(() => false),
    error: jest.fn(() => null),
  };
}

describe('UserManagerListComponent', () => {
  let component: UserManagerListComponent;
  let fixture: ComponentFixture<UserManagerListComponent>;
  let mockUserService: MockUserService;

  beforeEach(async () => {
    mockUserService = new MockUserService();

    await TestBed.configureTestingModule({
      imports: [UserManagerListComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagerListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading message when users are loading', () => {
    mockUserService.users.isLoading.mockReturnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loading users...');
  });

  it('should display "No users found" when no users exist', () => {
    mockUserService.users.isLoading.mockReturnValue(false);
    mockUserService.users.value.mockReturnValue([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No users found');
  });

  it('should initialize table data source', () => {
    expect(component.source).toBeDefined();
    expect(component.source.data).toEqual([]);
  });

  it('should have correct default pagination settings', () => {
    expect(component.defaultTablePageSize).toBe(10);
    expect(component.tablePageSizeOptions).toEqual([10, 25, 50, 100, 250, 500]);
  });

  it('should format display name with title when available', () => {
    const usersWithVariousTitles = [
      {
        name: 'John Doe',
        title: 'Dr.' as const,
        roles: ['data_steward'],
      },
      {
        name: 'Jane Smith',
        roles: ['data_steward'],
      },
      {
        name: 'Jeffrey Spencer Slate Sr.',
        title: 'Prof.' as const,
        roles: ['data_steward'],
      },
      {
        name: 'Thomas H. Morgan Sr.',
        title: 'Prof.' as const,
        roles: [],
      },
    ] as any;

    mockUserService.users.value.mockReturnValue(usersWithVariousTitles);

    const enhancedUsers = component.users();

    expect(enhancedUsers[0].displayName).toBe('Dr. John Doe');
    expect(enhancedUsers[0].sortName).toBe('Doe, John, Dr.');
    expect(enhancedUsers[0].roleNames).toEqual(['Data Steward']);

    expect(enhancedUsers[1].displayName).toBe('Jane Smith');
    expect(enhancedUsers[1].sortName).toBe('Smith, Jane');
    expect(enhancedUsers[1].roleNames).toEqual(['Data Steward']);

    expect(enhancedUsers[2].displayName).toBe('Prof. Jeffrey Spencer Slate Sr.');
    expect(enhancedUsers[2].sortName).toBe('Slate, Jeffrey Spencer Sr., Prof.');
    expect(enhancedUsers[2].roleNames).toEqual(['Data Steward']);

    expect(enhancedUsers[3].displayName).toBe('Prof. Thomas H. Morgan Sr.');
    expect(enhancedUsers[3].sortName).toBe('Morgan, Thomas H. Sr., Prof.');
    expect(enhancedUsers[3].roleNames).toEqual([]);
  });
});

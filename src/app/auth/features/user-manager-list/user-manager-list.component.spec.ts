/**
 * User Manager List component tests
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '@app/auth/services/user.service';
import { UserManagerListComponent } from './user-manager-list.component';

/**
 * Mock UserService for testing
 */
class MockUserService {
  allUsers = {
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
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagerListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading message when users are loading', () => {
    mockUserService.allUsers.isLoading.mockReturnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loading users...');
  });

  it('should display "No users found" when no users exist', () => {
    mockUserService.allUsers.isLoading.mockReturnValue(false);
    mockUserService.allUsers.value.mockReturnValue([]);
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
    const userWithTitle = {
      name: 'John Doe',
      title: 'Dr.' as const,
    } as any;

    const userWithoutTitle = {
      name: 'Jane Smith',
    } as any;

    expect(component.getDisplayName(userWithTitle)).toBe('Dr. John Doe');
    expect(component.getDisplayName(userWithoutTitle)).toBe('Jane Smith');
  });
});

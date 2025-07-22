/**
 * User Manager Detail component tests
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/auth/services/user.service';
import { UserManagerDetailComponent } from './user-manager-detail.component';

/**
 * Mock UserService for testing
 */
class MockUserService {
  users = {
    value: jest.fn(() => [
      {
        id: '123',
        name: 'John Doe',
        title: 'Dr.',
        email: 'john@example.com',
        ext_id: 'ext123',
        roles: ['data_steward'],
        status: 'active',
        registration_date: '2023-01-01',
      },
    ]),
    isLoading: jest.fn(() => false),
    error: jest.fn(() => null),
  };
}

/**
 * Mock ActivatedRoute for testing
 */
class MockActivatedRoute {
  snapshot = {
    params: { id: '123' },
  };
}

/**
 * Mock Router for testing
 */
class MockRouter {
  navigate = jest.fn();
}

describe('UserManagerDetailComponent', () => {
  let component: UserManagerDetailComponent;
  let fixture: ComponentFixture<UserManagerDetailComponent>;
  let mockUserService: MockUserService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockUserService = new MockUserService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [UserManagerDetailComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagerDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find and display user when ID matches', () => {
    const user = component.user();
    expect(user).toBeDefined();
    expect(user?.name).toBe('John Doe');
    expect(user?.title).toBe('Dr.');
  });

  it('should format user display name with title', () => {
    const displayName = component.userDisplayName();
    expect(displayName).toBe('Dr. John Doe');
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user-manager']);
  });

  it('should render user details when user is found', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('User: Dr. John Doe');
    expect(compiled.textContent).toContain('john@example.com');
    expect(compiled.textContent).toContain('ext123');
    expect(compiled.textContent).toContain(
      'Detail view functionality still needs to be implemented',
    );
  });

  it('should show not found message when user is not found', () => {
    // Override the mock to return empty array
    mockUserService.users.value.mockReturnValue([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('User Not Found');
  });
});

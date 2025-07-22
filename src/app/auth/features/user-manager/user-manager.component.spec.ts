/**
 * User Manager component tests
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@app/auth/services/auth.service';
import { UserManagerComponent } from './user-manager.component';

/**
 * Mock AuthService for testing
 */
class MockAuthService {
  loadUsers = jest.fn();
}

describe('UserManagerComponent', () => {
  let component: UserManagerComponent;
  let fixture: ComponentFixture<UserManagerComponent>;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    mockAuthService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [UserManagerComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUsers on initialization', () => {
    fixture.detectChanges();
    expect(mockAuthService.loadUsers).toHaveBeenCalled();
  });

  it('should render the title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('User Management');
  });

  it('should render placeholder content', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('User filters will be implemented here');
    expect(compiled.textContent).toContain('User list will be implemented here');
  });
});

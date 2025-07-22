/**
 * User Manager component tests
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '@app/auth/services/user.service';
import { UserManagerComponent } from './user-manager.component';

/**
 * Mock UserService for testing
 */
class MockUserService {
  allUsers = {
    value: jest.fn(() => []),
  };
}

describe('UserManagerComponent', () => {
  let component: UserManagerComponent;
  let fixture: ComponentFixture<UserManagerComponent>;
  let mockUserService: MockUserService;

  beforeEach(async () => {
    mockUserService = new MockUserService();

    await TestBed.configureTestingModule({
      imports: [UserManagerComponent],
    })
      .overrideComponent(UserManagerComponent, {
        set: {
          providers: [{ provide: UserService, useValue: mockUserService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserManagerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have userService injected', () => {
    expect(component.userService).toBeDefined();
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
    expect(compiled.querySelector('app-user-manager-list')).toBeTruthy();
  });
});

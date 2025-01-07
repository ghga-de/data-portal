/**
 * Test the site header component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { SiteHeaderComponent } from './site-header.component';

/**
 * Mock the auth service as needed for the site header
 */
class MockAuthService {
  /**
   * Initiate login
   */
  login() {
    this.isLoggedIn.update(() => true);
  }

  /**
   * Initiate logout
   */
  logout(): void {
    this.isLoggedIn.set(false);
  }

  isLoggedIn = signal(false);
}

describe('SiteHeaderComponent', () => {
  let component: SiteHeaderComponent;
  let fixture: ComponentFixture<SiteHeaderComponent>;

  const fakeActivatedRoute = {
    snapshot: { data: {} },
  } as ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute,
        },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SiteHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a toolbar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toolbar = compiled.querySelector('mat-toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should have a nav list inside the toolbar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toolbar = compiled.querySelector('mat-toolbar mat-nav-list');
    expect(toolbar).toBeTruthy();
  });

  it('should login and logout', async () => {
    const authService = TestBed.inject(AuthService);
    expect(authService.isLoggedIn()).toBe(false);

    const compiled = fixture.nativeElement as HTMLElement;

    const loginButton: HTMLButtonElement = compiled.querySelector(
      'mat-toolbar button[mat-icon-button]',
    )!;
    expect(loginButton).toBeTruthy();
    expect(loginButton.textContent).toContain('login');

    loginButton.click();

    expect(authService.isLoggedIn()).toBe(true);

    await fixture.whenStable();

    const logoutButton: HTMLButtonElement = compiled.querySelector(
      'mat-toolbar button[mat-icon-button]',
    )!;
    expect(logoutButton).toBeTruthy();
    expect(loginButton).not.toBe(logoutButton);
    expect(logoutButton.textContent).toContain('logout');

    logoutButton.click();

    expect(authService.isLoggedIn()).toBe(false);
  });
});

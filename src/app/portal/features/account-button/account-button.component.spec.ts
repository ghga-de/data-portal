/**
 * Test the account button component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountButtonComponent } from './account-button.component';

describe('AccountButtonComponent', () => {
  let component: AccountButtonComponent;
  let fixture: ComponentFixture<AccountButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

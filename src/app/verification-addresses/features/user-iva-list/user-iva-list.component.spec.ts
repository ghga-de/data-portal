/**
 * Test the user IVA list component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIvaListComponent } from './user-iva-list.component';

describe('UserIvaListComponent', () => {
  let component: UserIvaListComponent;
  let fixture: ComponentFixture<UserIvaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIvaListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserIvaListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/**
 * Test the Access Request Manager component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestManagerComponent } from './access-request-manager.component';

describe('AccessRequestManagerComponent', () => {
  let component: AccessRequestManagerComponent;
  let fixture: ComponentFixture<AccessRequestManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRequestManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessRequestManagerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

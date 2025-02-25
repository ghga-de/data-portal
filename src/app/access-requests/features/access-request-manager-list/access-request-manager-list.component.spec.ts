/**
 * Test the Access Request Manager List component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessRequestManagerListComponent } from './access-request-manager-list.component';

describe('AccessRequestManagerListComponent', () => {
  let component: AccessRequestManagerListComponent;
  let fixture: ComponentFixture<AccessRequestManagerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRequestManagerListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessRequestManagerListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

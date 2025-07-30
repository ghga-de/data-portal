/**
 * Test the Access Grant Manager Filter component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessGrantManagerFilterComponent } from './access-grant-manager-filter.component';

describe('AccessGrantManagerFilterComponent', () => {
  let component: AccessGrantManagerFilterComponent;
  let fixture: ComponentFixture<AccessGrantManagerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessGrantManagerFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessGrantManagerFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

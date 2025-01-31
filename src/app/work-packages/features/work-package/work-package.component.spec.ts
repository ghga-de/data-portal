/**
 * Test the work package creation component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkPackageComponent } from './work-package.component';

describe('WorkPackageComponent', () => {
  let component: WorkPackageComponent;
  let fixture: ComponentFixture<WorkPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkPackageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkPackageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

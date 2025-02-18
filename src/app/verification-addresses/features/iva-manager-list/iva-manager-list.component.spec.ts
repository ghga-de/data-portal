/**
 * Test the IVA Manager List component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvaManagerListComponent } from './iva-manager-list.component';

describe('IvaManagerListComponent', () => {
  let component: IvaManagerListComponent;
  let fixture: ComponentFixture<IvaManagerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IvaManagerListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IvaManagerListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

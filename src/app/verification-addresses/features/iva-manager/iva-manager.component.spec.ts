/**
 * Test the IVA Manager component.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvaManagerComponent } from './iva-manager.component';

describe('IvaManagerComponent', () => {
  let component: IvaManagerComponent;
  let fixture: ComponentFixture<IvaManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IvaManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IvaManagerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

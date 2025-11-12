/**
 * Tests for the high contrast button
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighContrastButton } from './high-contrast-button';

describe('HighContrastButton', () => {
  let component: HighContrastButton;
  let fixture: ComponentFixture<HighContrastButton>;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighContrastButton],
    }).compileComponents();

    fixture = TestBed.createComponent(HighContrastButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

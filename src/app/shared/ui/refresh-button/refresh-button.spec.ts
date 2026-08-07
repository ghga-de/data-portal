/**
 * Test the shared refresh button.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { RefreshButtonComponent } from './refresh-button';

describe('RefreshButtonComponent', () => {
  let fixture: ComponentFixture<RefreshButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefreshButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefreshButtonComponent);
    fixture.componentRef.setInput('what', 'the file list');
    await fixture.whenStable();
  });

  it('should name what it refreshes', () => {
    expect(screen.getByRole('button', { name: 'Refresh the file list' })).toBeVisible();
  });

  it('should emit when clicked', async () => {
    const refresh = vitest.fn();
    fixture.componentInstance.refresh.subscribe(refresh);
    screen.getByRole('button').click();
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('should be disabled while loading', async () => {
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when explicitly disabled', async () => {
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should report the umami event when given', async () => {
    fixture.componentRef.setInput('umamiEvent', 'Some Refresh Clicked');
    await fixture.whenStable();
    expect(screen.getByRole('button')).toHaveAttribute(
      'data-umami-event',
      'Some Refresh Clicked',
    );
  });
});

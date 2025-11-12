/**
 * Component for the toggle high contrast mode button
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * High contrast button component
 */
@Component({
  selector: 'app-high-contrast-button',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './high-contrast-button.html',
  styleUrl: './high-contrast-button.scss',
})
export class HighContrastButton implements OnInit {
  protected prefersContrastMore = signal(false);
  #renderer = inject(Renderer2);

  /**
   * When the component initialises, update the prefers high contrast setting
   */
  ngOnInit(): void {
    this.updateSetting();
  }

  /**
   * Update the prefers high contrast setting to match either the browser preference
   * (if no localStorage has been set yet) or the localStorage (the latter being priority)
   */
  updateSetting() {
    let prefersContrast = false;
    const localStoragePreference = localStorage.getItem('prefers-contrast-more');
    if (localStoragePreference) {
      prefersContrast = localStoragePreference === 'true';
    } else {
      prefersContrast = window.matchMedia('(prefers-contrast: more)').matches;
    }
    this.setContrast(prefersContrast);
  }

  /**
   * Sets the localStorage, CSS variable, and local signal to a given value
   * @param value The value to set the prefers contrast variables to
   */
  setContrast(value: boolean) {
    localStorage.setItem('prefers-contrast-more', value.toString());
    if (value) {
      this.#renderer.addClass(document.body, 'prefers-contrast-more');
      this.#renderer.removeClass(document.body, 'prefers-contrast-less');
    } else {
      this.#renderer.removeClass(document.body, 'prefers-contrast-more');
      this.#renderer.addClass(document.body, 'prefers-contrast-less');
    }
    this.prefersContrastMore.set(value);
  }

  /**
   * Toggles the prefers high contrast setting
   */
  toggleContrast() {
    this.setContrast(!this.prefersContrastMore());
  }
}

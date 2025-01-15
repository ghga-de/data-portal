/**
 * Home page component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HomePageGlobalStatsComponent } from '@app/metadata/features/home-page-global-stats/home-page-global-stats.component';

/**
 * This is the home page component
 */
@Component({
  selector: 'app-home-page',
  imports: [MatIcon, MatButtonModule, RouterLink, HomePageGlobalStatsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}

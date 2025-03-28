/**
 * Site header component
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AccountButtonComponent } from '../account-button/account-button.component';
import { SiteHeaderNavButtonsComponent } from '../site-header-nav-buttons/site-header-nav-buttons.component';

/**
 * This is the site header component
 */
@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatNavList,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    AccountButtonComponent,
    MatSidenavModule,
    SiteHeaderNavButtonsComponent,
  ],
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {}

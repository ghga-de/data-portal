import { Component } from '@angular/core';

/**
 * This is the site footer component
 */
@Component({
  selector: 'app-site-footer',
  imports: [],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  year = new Date().getFullYear();
}

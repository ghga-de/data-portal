import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

/**
 * This is the site footer component
 */
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  year = new Date().getFullYear();
}

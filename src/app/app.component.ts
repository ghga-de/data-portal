import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from '@app/shared/services/config.service';
import { SiteFooterComponent } from './shared/ui/site-footer/site-footer.component';
import { SiteHeaderComponent } from './shared/ui/site-header/site-header.component';

/**
 * This is the root component of the application.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'data-portal';

  #config = inject(ConfigService);

  massUrl = this.#config.massUrl; // just to show that we can access the config service
}

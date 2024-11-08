import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from '@app/shared/services/config.service';

/**
 * This is the root component of the application.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'data-portal';

  #config = inject(ConfigService);

  massUrl = this.#config.massUrl; // just to show that we can access the config service
}

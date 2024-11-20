import { Component, inject } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';

/**
 * This is the home page component
 */
@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  #auth = inject(AuthService);

  // eslint-disable-next-line jsdoc/require-jsdoc
  constructor() {
    console.log(this.#auth);
  }
}

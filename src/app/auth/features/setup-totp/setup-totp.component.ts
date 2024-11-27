import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app/auth/services/auth.service';
import { QRCodeComponent } from 'angularx-qrcode';

// TODO: Polish this component

/**
 * TOTP setup page
 */
@Component({
  selector: 'app-setup-totp',
  imports: [CommonModule, QRCodeComponent, MatButtonModule],
  templateUrl: './setup-totp.component.html',
  styleUrl: './setup-totp.component.scss',
})
export class SetupTotpComponent {
  #authService = inject(AuthService);

  provisioningUri = computed(async () => {
    const authService = this.#authService;
    if (authService.isDetermined()) {
      return await authService.createTotpToken();
    }
    return undefined;
  });

  showManualSetup = false;

  /**
   * Get the actual secret from the query parameter in the URI
   * @param uri The provisioning URI containing the secret
   * @returns just the secret from the URI
   */
  getSecret(uri: string): string {
    return new URLSearchParams(uri.substring(uri.indexOf('?'))).get('secret')!;
  }

  /**
   * Copy the secret to the clipboard
   * @param uri The provisioning URI containing the secret
   */
  copySecret(uri: string): void {
    navigator.clipboard.writeText(this.getSecret(uri));
  }

  /**
   * Complete the TOTP setup
   *
   * Assume that the user has added the TOTP token to the authenticator
   * and continue with the verification step.
   */
  completeSetup(): void {
    this.#authService.completeTotpSetup();
  }
}

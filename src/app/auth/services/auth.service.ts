import { inject, Injectable } from '@angular/core';
import { ConfigService } from '@app/shared/services/config.service';
import type { OidcMetadata, UserManagerSettings } from 'oidc-client-ts';
import { UserManager } from 'oidc-client-ts';

/**
 * Authentication service
 *
 * This service provides the OIDC and 2FA related functionality
 * and keeps track of the state of the user session.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #config = inject(ConfigService);

  private userManager: UserManager;

  /**
   * Initializes the authentication service
   */
  constructor() {
    const settings = this.getSettings();
    this.userManager = new UserManager(settings);

    this.userManager.signinRedirect();
  }

  /**
   * Gets the OIDC related settings
   *
   * These settings are derived from the application configuration
   * and transformed into a UserManagerSettings object.
   * @returns the settings as a UserManagerSettings object
   */
  private getSettings(): UserManagerSettings {
    const config = this.#config;

    const settings: UserManagerSettings = {
      authority: config.oidcAuthorityUrl,
      client_id: config.oidcClientId,
      redirect_uri: config.oidcRedirectUrl,
      response_type: 'code',
      scope: config.oidcScope,
      loadUserInfo: false,
      automaticSilentRenew: false,
    };

    const metadata: Partial<OidcMetadata> = {
      issuer: config.oidcAuthorityUrl,
      authorization_endpoint: config.oidcAuthorizationUrl,
      token_endpoint: config.oidcTokenUrl,
      userinfo_endpoint: config.oidcUserInfoUrl,
    };

    /**
     * If the "use_discovery" is true, we use the OIDC discovery mechanism
     * to provide the metadata, and only seed it with the configured settings.
     * Note that this requires an additional request and will only
     * work if the origin header for a registered client is passed.
     */
    if (config.oidcUseDiscovery) {
      settings.metadataSeed = metadata;
    } else {
      settings.metadata = metadata;
    }

    return settings;
  }
}

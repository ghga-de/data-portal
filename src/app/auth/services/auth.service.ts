import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '@app/shared/services/config.service';
import type { OidcMetadata, UserManagerSettings } from 'oidc-client-ts';
import {
  Log as OidcLog,
  User as OidcUser,
  UserManager as OidcUserManager,
} from 'oidc-client-ts';

/**
 * All possible states of the user session
 */
export type LoginState =
  | 'Undetermined'
  | 'LoggedOut'
  | 'LoggedIn'
  | 'NeedsRegistration'
  | 'NeedsReRegistration'
  | 'Registered'
  | 'NeedsTotpToken'
  | 'LostTotpToken'
  | 'NewTotpToken'
  | 'HasTotpToken'
  | 'Authenticated';

/**
 * User session interface
 *
 * Note that this is different from the low-level oidcUser object,
 * which does not contain the user data from the backend.
 */
export interface User {
  id?: string;
  ext_id: string;
  name: string;
  title?: string;
  full_name: string;
  email: string;
  state: LoginState;
  role?: string;
  csrf: string;
  timeout?: number;
  extends?: number;
}

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
  #router = inject(Router);
  #userSignal = signal<User | null | undefined>(undefined);

  #oidcUserManager: OidcUserManager;

  /**
   * Get the current user session as a signal
   *
   * Null means that the user is not logged in (state is 'Anonymous'), while
   * undefined means that the session has not yet been loaded (state 'Undetermined').
   */
  user = computed<User | null | undefined>(() => this.#userSignal());

  /**
   * Check whether the session state is known as a signal
   */
  isDetermined = computed<boolean>(() => !!this.user() !== undefined);

  /**
   * Check whether the user has been logged in with first factor as a signal
   */
  isLoggedIn = computed<boolean>(() => !!this.user());

  /**
   * Check whether the user is fully authenticated with second factor as a signal
   */
  isAuthenticated = computed<boolean>(() => this.user()?.state == 'Authenticated');

  /**
   * Get the current user session state as a signal
   */
  sessionState = computed<LoginState>(() => {
    const state = this.user()?.state;
    return state || (state === null ? 'LoggedOut' : 'Undetermined');
  });

  /**
   * Get the full name of the current user (with title) as a signal
   */
  fullName = computed<string | undefined>(() => this.user()?.full_name);

  /**
   * Initialize the authentication service
   */
  constructor() {
    this.#oidcUserManager = new OidcUserManager(this.getOidcSettings());

    OidcLog.setLogger(console);
    OidcLog.setLevel(OidcLog.INFO); // set to DEBUG for more output
  }

  /**
   * Gets the OIDC related settings
   *
   * These settings are derived from the application configuration
   * and transformed into a UserManagerSettings object.
   * @returns the settings as a UserManagerSettings object
   */
  private getOidcSettings(): UserManagerSettings {
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

  /**
   * Initiate login via OIDC
   *
   * This returns a promise to trigger a redirect of the current window
   * to the authorization endpoint of the OIDC provider.
   */
  async login(): Promise<void> {
    this.#oidcUserManager.signinRedirect();
  }

  /**
   * Handle OIDC redirect callback
   *
   * This method can be used as a canActivate guard for the OAuth callback route.
   * @returns always false to prevent the route from being activated
   */
  async oidcRedirect(): Promise<boolean> {
    if (await this.#oidcUserManager.getUser()) return false; // already logged in
    let oidcUser: OidcUser | undefined;
    let errorMessage: string | undefined;
    try {
      oidcUser = await this.#oidcUserManager.signinCallback();
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : String(e);
    }

    if (oidcUser) {
      if (!oidcUser.profile?.sub) {
        errorMessage = 'No OpenID connect user';
      } else if (oidcUser.expired) {
        errorMessage = 'OpenID connect login expired';
      }
    }

    if (!oidcUser || errorMessage) {
      if (!errorMessage) {
        errorMessage = 'OpenID connect login failed';
      }
      console.error(errorMessage); // TODO: also add a toast message
      return false;
    }

    console.info('OIDC user:', oidcUser); // TODO: make this a toast message

    const name = oidcUser.profile?.name || ''; // TODO: get this from session
    const email = oidcUser.profile?.email || ''; // TODO: get this from session
    this.#userSignal.set({
      ext_id: oidcUser.profile?.sub,
      name,
      full_name: name,
      email: email,
      state: 'LoggedIn',
      csrf: 'todo', // TODO: get this from session
    });
    this.#router.navigate(['/']); // TODO: maybe redirect to registration or 2FA
    return false;
  }

  /**
   * Login user via OIDC
   *
   * This returns a promise to trigger a redirect of the current window
   * to the authorization endpoint of the OIDC provider.
   */
  async logout(): Promise<void> {
    await this.#oidcUserManager.removeUser();
    this.#userSignal.set(null);
  }
}

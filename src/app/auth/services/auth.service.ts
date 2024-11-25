import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '@app/shared/services/config.service';
import type { OidcMetadata, UserManagerSettings } from 'oidc-client-ts';
import {
  Log as OidcLog,
  User as OidcUser,
  UserManager as OidcUserManager,
} from 'oidc-client-ts';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { CsrfService } from './csrf.service';

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
@Injectable({ providedIn: 'root' })
export class AuthService {
  #config = inject(ConfigService);
  #http = inject(HttpClient);
  #router = inject(Router);
  #csrf = inject(CsrfService);
  #userSignal = signal<User | null | undefined>(undefined);

  #redirectAfterLogin = '/';

  #oidcUserManager: OidcUserManager;

  #authUrl = this.#config.authUrl;
  #loginUrl = `${this.#authUrl}/rpc/login`;
  #logoutUrl = `${this.#authUrl}/rpc/logout`;
  #verifyTotpUrl = `${this.#authUrl}/rpc/verify-totp`;

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

    /**
     * On page load we must also load the user session from the server.
     * We can only skip this when this is the callback page, since int
     * this case the session is loaded with oidcRedirect().
     */
    if (window.location.pathname !== '/oauth/callback') {
      this.#loadUserSession();
    }
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
    this.#redirectAfterLogin = location.pathname;
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
      } else if (!oidcUser.access_token) {
        errorMessage = 'No OpenID connect access token';
      }
    }

    if (!oidcUser || errorMessage) {
      if (!errorMessage) {
        errorMessage = 'OpenID connect login failed';
      }
      console.error(errorMessage); // TODO: also add a toast message
      return false;
    }

    this.#loadUserSession(oidcUser.access_token);
    return false;
  }

  /**
   * Login user via OIDC
   *
   * This returns a promise to trigger a redirect of the current window
   * to the authorization endpoint of the OIDC provider.
   */
  async logout(): Promise<void> {
    if (this.#userSignal()) {
      firstValueFrom(
        this.#http.post<void>(this.#logoutUrl, null).pipe(
          map(() => true),
          catchError(() => of(false)),
        ),
      ).then(async () => {
        await this.#oidcUserManager.removeUser();
        this.#userSignal.set(null);
        this.#csrf.token = null;
        this.#redirectAfterLogin = '/';
        this.#router.navigate(['/']);
      });
    }
  }

  /**
   * Get the deserialized user session from a JSON-formatted string.
   * @param session the session as a JSON-formatted string or null
   * @returns the parsed user or null if no session or undefined if error
   */
  #parseUserFromSession(session: string): User | null | undefined {
    if (!session) return null;
    let user: User | null;
    try {
      user = JSON.parse(session || 'null');
      if (!user) return null;
      if (!(user.ext_id && user.name && user.email)) {
        throw new Error('Missing properties in user session');
      }
    } catch (error) {
      console.error('Cannot parse user session:', session, error);
      return undefined;
    }
    if (!user.full_name) {
      user.full_name = (user.title ? user.title + ' ' : '') + user.name;
    }
    return user;
  }

  /**
   * Load the current user session
   *
   * This method should be called once to load the user session.
   * @param accessToken the access token to use for logging in
   */
  async #loadUserSession(accessToken: string | undefined = undefined): Promise<void> {
    console.debug('Loading user session...');
    const userSignal = this.#userSignal;
    let headers = new HttpHeaders();
    if (accessToken) headers = headers.set('X-Authorization', `Bearer ${accessToken}`);
    this.#http
      .post<null>(this.#loginUrl, null, { observe: 'response', headers })
      .pipe(
        // map to user or null if not found or undefined if error
        map((response: HttpResponse<null>) => {
          if (response.status !== 204 || response.body) return undefined;
          const session = response.headers.get('X-Session');
          if (!session) return undefined;
          return this.#parseUserFromSession(session);
        }),
        catchError((error) =>
          of([401, 403, 404].includes(error?.status) ? null : undefined),
        ),
      )
      .subscribe((user: User | null | undefined) => {
        if (user) {
          console.debug('User session loaded:', user);
          userSignal.set(user);
          this.#csrf.token = user.csrf;
          const router = this.#router;
          switch (user.state) {
            case 'NeedsRegistration':
              router.navigate(['/register']);
              break;
            case 'Registered':
            case 'NeedsTotpToken':
            case 'LostTotpToken':
            case 'NewTotpToken':
              router.navigate(['/setup-totp']);
              break;
            case 'HasTotpToken':
              router.navigate(['/confirm-totp']);
              break;
          }
        } else {
          if (accessToken || user === undefined) {
            console.error('Failed to load user session');
            // TODO: also add a toast message
          }
          this.#oidcUserManager.removeUser();
          userSignal.set(user);
          this.#csrf.token = null;
        }
      });
  }

  /**
   * Verify the given TOTP code
   * @param code the 6-digit TOTP code to verify
   * @returns a promise that resolves to true if the code is valid
   */
  async verifyTotpCode(code: string): Promise<boolean> {
    let headers = new HttpHeaders();
    headers = headers.set('X-Authorization', `Bearer TOTP:${code}`);
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      console.error('Invalid TOTP code');
      return false;
    }
    return firstValueFrom(
      this.#http.post<null>(this.#verifyTotpUrl, null, { headers }).pipe(
        map(() => {
          console.info('TOTP code verified');
          this.#userSignal.update((user) => {
            if (user) {
              user.state = 'Authenticated';
            }
            return user;
          });
          return true;
        }),
        catchError(() => {
          console.error('Failed to verify TOTP code');
          return of(false);
        }),
      ),
    );
  }

  /**
   * Redirect back to the original page after login
   */
  redirectAfterLogin() {
    this.#router.navigate([this.#redirectAfterLogin]);
  }
}

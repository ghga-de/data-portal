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
 * All possible academic titles
 */
export type AcademicTitle = null | 'Dr.' | 'Prof.';

/**
 * Basic data of a user
 */
export interface UserBasicData {
  name: string;
  title?: AcademicTitle;
  email: string;
}

/**
 * Basic data of a registered user
 */
export interface UserRegisteredData extends UserBasicData {
  ext_id: string;
}

/**
 * User session interface
 *
 * Contains all data describing the user and the user session.
 *
 * Note that this is different from the low-level oidcUser object,
 * which does not contain the user data from the backend.
 */
export interface User extends UserRegisteredData {
  id?: string;
  full_name: string;
  state: LoginState;
  role?: string;
  csrf: string;
  timeout?: number;
  extends?: number;
}

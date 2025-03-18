/**
 * IVA model
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

export enum IvaState {
  Unverified = 'Unverified',
  CodeRequested = 'CodeRequested',
  CodeCreated = 'CodeCreated',
  CodeTransmitted = 'CodeTransmitted',
  Verified = 'Verified',
}

export enum IvaType {
  Phone = 'Phone',
  Fax = 'Fax',
  PostalAddress = 'PostalAddress',
  InPerson = 'InPerson',
}

export interface Iva {
  id: string;
  type: IvaType;
  value: string;
  changed: string;
  state: IvaState;
}

export interface UserWithIva extends Iva {
  user_id: string;
  user_name: string;
  user_email: string;
}

export interface IvaFilter {
  name: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  state: IvaState | undefined;
}

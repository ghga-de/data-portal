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

export const IvaStatePrintable: { [K in keyof typeof IvaState]: string } = {
  Unverified: 'Unverified',
  CodeRequested: 'Code Requested',
  CodeCreated: 'Code Created',
  CodeTransmitted: 'Code Transmitted',
  Verified: 'Verified',
};

export enum IvaType {
  Phone = 'Phone',
  Fax = 'Fax',
  PostalAddress = 'PostalAddress',
  InPerson = 'InPerson',
}

export const IvaTypePrintable: { [K in keyof typeof IvaType]: string } = {
  Phone: 'SMS',
  Fax: 'Fax',
  PostalAddress: 'Postal Address',
  InPerson: 'In Person',
};

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

export const IVA_TYPE_ICONS: { [K in keyof typeof IvaType]: string } = {
  Phone: 'smartphone',
  Fax: 'fax',
  PostalAddress: 'local_post_office',
  InPerson: 'handshakes',
};

export const IVA_STATUS_CLASS: { [K in keyof typeof IvaState]: string } = {
  Unverified: 'text-error',
  CodeRequested: 'text-warning',
  CodeCreated: 'text-quaternary',
  CodeTransmitted: '',
  Verified: 'text-success',
};

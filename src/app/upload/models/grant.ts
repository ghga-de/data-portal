/**
 * Upload grant related models
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

/** An upload access grant. */
export interface UploadGrant {
  /** Internal grant ID (same as claim ID) */
  id: string;
  /** Internal user ID */
  user_id: string;
  /** ID of an IVA associated with this grant */
  iva_id: string | null;
  /** ID of the upload box this grant is for */
  box_id: string;
  /** Date of creation of this grant */
  created: string;
  /** Start date of validity */
  valid_from: string;
  /** End date of validity */
  valid_until: string;
  /** Full name of the user */
  user_name: string;
  /** The email address of the user */
  user_email: string;
  /** Academic title of the user */
  user_title: string | null;
}

/** An UploadGrant with the ResearchDataUploadBox title and description. */
export interface GrantWithBoxInfo extends UploadGrant {
  /** Short meaningful name for the box */
  box_title: string;
  /** Describes the upload box in more detail */
  box_description: string;
}

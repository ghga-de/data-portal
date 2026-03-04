/**
 * Upload box related models
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

/**
 * All possible research upload box states
 */
export enum UploadBoxState {
  open = 'open',
  locked = 'locked',
  archived = 'archived',
}

/** A research data upload box */
export interface ResearchDataUploadBox {
  id: string;
  version: number;
  state: UploadBoxState;
  title: string;
  description: string;
  last_changed: string; // ISO date string
  changed_by: string;
  file_count: number;
  size: number; // in bytes
  storage_alias: string;
}

/** Response when retrieving research data upload boxes */
export interface BoxRetrievalResults {
  count: number;
  boxes: ResearchDataUploadBox[];
}

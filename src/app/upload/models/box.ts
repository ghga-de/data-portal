/**
 * Upload box related models
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

/** All possible research upload box states */
export enum UploadBoxState {
  open = 'open',
  locked = 'locked',
  archived = 'archived',
}

/** State-specific classes for upload boxes */
export const UploadBoxStateClass: Record<UploadBoxState, string> = {
  open: 'text-success',
  locked: 'text-warning',
  archived: 'text-gray-600',
};

/** Base data required to create a research data upload box */
export interface ResearchDataUploadBoxBase {
  title: string;
  description: string;
  storage_alias: string;
}

/** All data describing a research data upload box */
export interface ResearchDataUploadBox extends ResearchDataUploadBoxBase {
  id: string;
  version: number;
  state: UploadBoxState;
  last_changed: string; // ISO date string
  changed_by: string;
  file_count: number;
  size: number; // in bytes
}

/** Data to update a research data upload box */
export interface ResearchDataUploadBoxUpdate {
  version: number;
  state?: UploadBoxState;
  title?: string;
  description?: string;
}

/** Response when retrieving research data upload boxes */
export interface BoxRetrievalResults {
  count: number;
  boxes: ResearchDataUploadBox[];
}

/** Filters for upload box management */
export interface UploadBoxFilter {
  title: string | undefined;
  state: UploadBoxState | undefined;
  location: string | undefined;
}

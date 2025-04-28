/**
 * Interface for the storage aliases.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

export interface HumanReadableStorageAliases {
  [key: string]: string;
}

export interface BaseHumanReadableStorageAliases {
  alias_decodes: HumanReadableStorageAliases;
}

export const emptyHumanReadableStorageAliases: HumanReadableStorageAliases = {};

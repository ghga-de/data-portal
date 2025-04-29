/**
 * Interface for the storage aliases.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

export interface storageAliasDecodes {
  [key: string]: string;
}

export interface BaseStorageAliasDecodes {
  storage_alias_decodes: storageAliasDecodes;
}

export const emptyStorageAliasDecodes: storageAliasDecodes = {};

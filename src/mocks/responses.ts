/**
 * Mock REST responses
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import {
  allIvas,
  allIvasOfDoe,
  allIvasOfRoe,
  datasetInformation,
  datasets,
  getAccessRequests,
  getDatasetDetails,
  getDatasetSummary,
  metadataGlobalSummary,
  searchResults,
  workPackageResponse,
} from './data';

export type ResponseValue = undefined | number | object;

/**
 * MSW responses to be returned for various endpoints of our API.
 *
 * The property names must contain a method and a URL separated by a space
 * and the values can be undefined (do not mock this endpoint)
 * a number (use it as response status), or an object (return it as JSON).
 */

export const responses: { [endpoint: string]: ResponseValue } = {
  /**
   * Auth API including 2FA and IVAs
   */

  // User IVAs
  'GET /api/auth/users/doe@test.dev/ivas': allIvasOfDoe,
  'GET /api/auth/users/roe@test.dev/ivas': allIvasOfRoe,

  // New IVA
  'POST /api/auth/users/*/ivas': { id: 'TEST123456789' },

  // Delete IVA
  'DELETE /api/auth/users/*/ivas/*': 204,

  // Request IVA verification
  'POST /api/auth/rpc/ivas/*/request-code': 204,

  // Create IVA verification code
  'POST /api/auth/rpc/ivas/*/create-code': {
    verification_code: 'TEST123456789',
  },

  // Request IVA verification
  'POST /api/auth/rpc/ivas/*/code-transmitted': 204,

  // Request IVA verification with correct code
  'POST /api/auth/rpc/ivas/*/validate-code?verification_code=ABC123': 204,

  // Request IVA verification with others codes
  'POST /api/auth/rpc/ivas/*/validate-code': 401,

  // Get all IVAs
  'GET /api/auth/ivas': allIvas,

  // Invalidate an access request
  'POST /api/auth/rpc/ivas/*/unverify': 204,

  /**
   * Metldata API
   */

  'GET /api/metldata/stats': metadataGlobalSummary,

  // Get summary data from a single dataset
  'GET /api/metldata/artifacts/stats_public/classes/DatasetStats/resources/GHGAD588887987':
    getDatasetSummary('GHGAD588887987'),
  // Get summary data from a single dataset
  'GET /api/metldata/artifacts/stats_public/classes/DatasetStats/resources/GHGAD588887988':
    getDatasetSummary('GHGAD588887988'),
  // Get summary data from a single dataset
  'GET /api/metldata/artifacts/stats_public/classes/DatasetStats/resources/GHGAD588887989':
    getDatasetSummary('GHGAD588887989'),

  // Get dataset details (embedded)
  'GET /api/metldata/artifacts/embedded_public/classes/EmbeddedDataset/resources/GHGAD588887987':
    getDatasetDetails('GHGAD588887987'),
  'GET /api/metldata/artifacts/embedded_public/classes/EmbeddedDataset/resources/GHGAD588887988':
    getDatasetDetails('GHGAD588887988'),
  'GET /api/metldata/artifacts/embedded_public/classes/EmbeddedDataset/resources/GHGAD588887989':
    getDatasetDetails('GHGAD588887989'),

  /**
   * MASS API
   */

  'GET /api/mass/search*': {
    facets: searchResults.facets,
    count: searchResults.count,
    hits: searchResults.hits,
  },

  /**
   * DINS API
   */

  // Get summary data from all files in a dataset
  'GET /api/dins/dataset_information/*': datasetInformation,

  /**
   * WPS API
   */

  // Datasets requested by doe@test.dev user
  'GET /api/wps/users/doe@test.dev/datasets': datasets,

  // Work package token returned after creating a work package
  'POST /api/wps/work-packages': workPackageResponse,

  // Simulate creating a work package with a bad file ID
  'POST /api/wps/work-packages?file_ids=["error"]': 403,

  /**
   * ARS API
   */
  // Specific dataset and user access requests
  'GET /api/ars/access-requests?dataset_id=GHGAD588887987&*': getAccessRequests(
    'doe@test.dev',
    'GHGAD588887987',
  ),

  // Specific dataset and user access requests
  'GET /api/ars/access-requests?*': getAccessRequests('doe@test.dev'),

  // All access requests
  'GET /api/ars/access-requests': getAccessRequests(),

  // All access requests
  'POST /api/ars/access-requests': 204,

  // Patch an access request
  'PATCH /api/ars/access-requests/*': 204,

  /**
   * Static assets
   */
  'GET /assets/*': undefined,
  'GET /*.css': undefined,
  'GET /*.js': undefined,
  'GET /*.woff2': undefined,
};

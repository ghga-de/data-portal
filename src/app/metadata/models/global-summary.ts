/**
 * Interface for the global metadata summary
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

export interface GlobalSummary {
  resource_stats: {
    Dataset: { count: number };
    ExperimentMethod: {
      count: number;
      stats: { instrument_model: { value: string; count: number }[] };
    };
    Individual: {
      count: number;
      stats: { sex: { value: string; count: number }[] };
    };
    SequencingProcessFile: {
      count: number;
      stats: { format: { value: string; count: number }[] };
    };
  };
}

/**
 * Interface for the global metadata summary
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

export interface GlobalSummary {
  Dataset: { count: number };
  ExperimentMethod: {
    count: number;
    stats?: { instrument_model: { value: string; count: number }[] };
  };
  Individual: {
    count: number;
    stats?: { sex: { value: string; count: number }[] };
  };
  AnalysisMethodSupportingFile: {
    count: number;
    stats?: { format: { value: string; count: number }[] };
  };
  ExperimentMethodSupportingFile: {
    count: number;
    stats?: { format: { value: string; count: number }[] };
  };
  IndividualSupportingFile: {
    count: number;
    stats?: { format: { value: string; count: number }[] };
  };
  ProcessDataFile: {
    count: number;
    stats?: { format: { value: string; count: number }[] };
  };
  ResearchDataFile: {
    count: number;
    stats?: { format: { value: string; count: number }[] };
  };
}

export interface FileStatsModel {
  count: number;
  stats?: { format: { value: string; count: number }[] };
}

export interface BaseGlobalSummary {
  resource_stats: GlobalSummary;
}

export const emptyGlobalSummary: GlobalSummary = {
  Dataset: { count: 0 },
  ExperimentMethod: { count: 0 },
  Individual: { count: 0 },
  AnalysisMethodSupportingFile: { count: 0 },
  ExperimentMethodSupportingFile: { count: 0 },
  IndividualSupportingFile: { count: 0 },
  ProcessDataFile: { count: 0 },
  ResearchDataFile: { count: 0 },
};

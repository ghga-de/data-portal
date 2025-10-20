/**
 * Models for the dataset details table
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Experiment, File, Sample } from './dataset-details';

export interface DatasetDetailsTableColumn {
  columnDef: string;
  header: string;
  class?: string;
  variableName: string;
  childVariable?: string;
  hidden?: boolean;
}

export const experimentTableColumns: DatasetDetailsTableColumn[] = [
  {
    columnDef: 'accession',
    header: 'Experiment ID',
    class: 'w-40',
    variableName: 'accession',
  },
  {
    columnDef: 'ega_accession',
    header: 'EGA ID',
    class: 'w-40',
    variableName: 'ega_accession',
  },
  {
    columnDef: 'title',
    header: 'Title',
    variableName: 'title',
  },
  {
    columnDef: 'description',
    header: 'Description',
    class: 'w-2/5 min-w-xl',
    variableName: 'description',
  },
  {
    columnDef: 'method',
    header: 'Method',
    variableName: 'experiment_method',
    childVariable: 'name',
  },
  {
    columnDef: 'platform',
    header: 'Platform',
    variableName: 'experiment_method',
    childVariable: 'instrument_model',
  },
];
export const sampleTableColumns: DatasetDetailsTableColumn[] = [
  {
    columnDef: 'accession',
    header: 'Sample ID',
    class: 'w-40',
    variableName: 'accession',
  },
  {
    columnDef: 'ega_accession',
    header: 'EGA ID',
    class: 'w-40',
    variableName: 'ega_accession',
  },
  {
    columnDef: 'description',
    header: 'Description',
    class: 'w-2/5 min-w-xl',
    variableName: 'description',
  },
  {
    columnDef: 'status',
    header: 'Status',
    variableName: 'case_control_status',
  },
  {
    columnDef: 'sex',
    header: 'Sex',
    variableName: 'individual',
    childVariable: 'sex',
  },
  {
    columnDef: 'phenotype',
    header: 'Phenotype',
    variableName: 'individual',
    childVariable: 'phenotypic_features_terms',
  },
  {
    columnDef: 'biospecimen_type',
    header: 'Biospecimen type',
    variableName: 'biospecimen_type',
  },
  {
    columnDef: 'tissue',
    header: 'Tissue',
    variableName: 'biospecimen_tissue_term',
  },
];
export const fileTableColumns: DatasetDetailsTableColumn[] = [
  {
    columnDef: 'accession',
    header: 'File ID',
    class: 'w-40',
    variableName: 'accession',
  },
  {
    columnDef: 'ega_accession',
    header: 'EGA ID',
    class: 'w-40',
    variableName: 'ega_accession',
  },
  {
    columnDef: 'name',
    header: 'File name',
    class: 'min-w-48',
    variableName: 'name',
  },
  {
    columnDef: 'type',
    header: 'File type',
    variableName: 'format',
  },
  {
    columnDef: 'origin',
    header: 'File origin',
    variableName: 'file_category',
  },
  {
    columnDef: 'size',
    header: 'File size',
    variableName: 'file_information',
    childVariable: 'size',
  },
  {
    columnDef: 'location',
    header: 'Storage location',
    variableName: 'file_information',
    childVariable: 'storage_alias',
  },
  {
    columnDef: 'hash',
    header: 'File hash',
    variableName: 'file_information',
    childVariable: 'sha256_hash',
  },
];

export const experimentsSortingDataAccessor = (experiment: Experiment, key: string) => {
  switch (key) {
    case 'method':
      return experiment.experiment_method.name;
    case 'platform':
      return experiment.experiment_method.instrument_model;
    default:
      const value = experiment[key as keyof Experiment];
      if (typeof value === 'string' || typeof value === 'number') {
        return value;
      }
      return '';
  }
};

export const samplesSortingDataAccessor = (sample: Sample, key: string) => {
  switch (key) {
    case 'status':
      return sample.case_control_status;
    case 'sex':
      return sample.individual.sex;
    case 'phenotype':
      return (sample.individual.phenotypic_features_terms || []).join(', ');
    case 'tissue':
      return sample.biospecimen_tissue_term || '';
    default:
      const value = sample[key as keyof Sample];
      if (typeof value === 'string' || typeof value === 'number') {
        return value;
      }
      return '';
  }
};

export const filesSortingDataAccessor = (file: File, key: string) => {
  switch (key) {
    case 'type':
      return file.format;
    case 'origin':
      return file.file_category ?? '';
    case 'size':
      return file.file_information?.size ?? '';
    case 'location':
      return file.file_information?.storage_alias ?? '';
    case 'hash':
      return file.file_information?.sha256_hash ?? '';
    default:
      const value = file[key as keyof File];
      if (typeof value === 'string' || typeof value === 'number') {
        return value;
      }
      return '';
  }
};

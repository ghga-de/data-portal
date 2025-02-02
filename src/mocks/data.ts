/**
 * Mock data to be used in MSW responses
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { DatasetDetails } from '@app/metadata/models/dataset-details';
import { DatasetInformation } from '@app/metadata/models/dataset-information';
import { DatasetSummary } from '@app/metadata/models/dataset-summary';
import { BaseGlobalSummary } from '@app/metadata/models/global-summary';
import { SearchResults } from '@app/metadata/models/search-results';

/**
 * Metldata API
 */

// get dataset summaries with arbitrary accessions
export const getDatasetSummary = (accession: string) => ({
  ...datasetSummary,
  accession: accession,
});

// get embedded datasets with arbitrary accessions
export const getDatasetDetails = (accession: string) => ({
  ...datasetDetails,
  accession: accession,
  ega_accession: accession.replace('GHGA', 'EGA'),
});

export const metadataGlobalSummary: BaseGlobalSummary = {
  resource_stats: {
    ProcessDataFile: {
      count: 532,
      stats: {
        format: [
          { value: 'fastq', count: 124 },
          { value: 'bam', count: 408 },
        ],
      },
    },
    Individual: {
      count: 5432,
      stats: {
        sex: [
          { value: 'Female', count: 1935 },
          { value: 'Male', count: 2358 },
        ],
      },
    },
    ExperimentMethod: {
      count: 1400,
      stats: {
        instrument_model: [
          {
            value: 'Ilumina_test',
            count: 700,
          },
          {
            value: 'HiSeq_test',
            count: 700,
          },
        ],
      },
    },
    Dataset: {
      count: 252,
    },
  },
};

export const datasetSummary: DatasetSummary = {
  accession: 'GHGAD588887987',
  description:
    'This is the test dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel risus commodo viverra maecenas accumsan lacus vel. Sit amet risus nullam eget felis eget nunc lobortis mattis. Iaculis at erat pellentesque adipiscing commodo. Volutpat consequat mauris nunc congue. At lectus urna duis convallis convallis tellus id interdum velit. Gravida cum sociis natoque penatibus et. Mauris in aliquam sem fringilla ut morbi. Ultrices gravida dictum fusce ut. At consectetur lorem donec massa sapien faucibus et molestie.',
  types: ['Test Type'],
  title: 'Test dataset for details',
  dac_email: 'test@some.dac.org',
  samples_summary: {
    count: 3,
    stats: {
      sex: [
        { value: 'Female', count: 1 },
        { value: 'Male', count: 1 },
      ],
      tissues: [
        { value: 'metastasis', count: 1 },
        { value: 'tumor', count: 2 },
      ],
      phenotypic_features: [
        { value: 'Test Phenotype 1', count: 2 },
        { value: 'Test Phenotype 2', count: 1 },
      ],
    },
  },
  studies_summary: {
    count: 1,
    stats: {
      accession: 'TEST18666800',
      title: 'Test Study',
    },
  },
  experiments_summary: {
    count: 14,
    stats: {
      experiment_methods: [
        {
          value: 'Ilumina_test',
          count: 10,
        },
        { value: 'HiSeq_test', count: 4 },
      ],
    },
  },
  files_summary: {
    count: 27,
    stats: {
      format: [
        { value: 'FASTQ', count: 22 },
        { value: 'BAM', count: 5 },
      ],
    },
  },
};

/**
 * MASS API
 */

export const searchResults: SearchResults = {
  facets: [
    {
      key: 'studies.type',
      name: 'Study Type',
      options: [
        { value: 'Option 1', count: 62 },
        { value: 'Option 2', count: 37 },
      ],
    },
    {
      key: 'type',
      name: 'Dataset Type',
      options: [
        { value: 'Test dataset type 1', count: 12 },
        { value: 'Test dataset type 2', count: 87 },
      ],
    },
  ],
  count: 25, // just to test the paginator
  hits: [
    {
      id_: 'GHGAD588887987',
      content: {
        alias: 'EGAD588887987',
        title:
          'Test dataset for details and this is also testing whether two lines of text actually appear correctly on the expansion panel headers or not at least at a resolution of one thousand nine hundred and twenty pixels wide',
      },
    },
    {
      id_: 'GHGAD588887988',
      content: {
        alias: 'EGAD588887988',
        title: 'Test dataset for details',
      },
    },
    {
      id_: 'GHGAD588887989',
      content: {
        alias: 'EGAD588887989',
        title:
          'Test dataset for details and this is also testing whether more than two lines of text actually appear correctly on the expansion panel headers or not at least at a resolution of one thousand nine hundred and twenty pixels wide especially since this can cause issues with the layout of the expansion panels',
      },
    },
  ],
};

export const datasetDetails: DatasetDetails = {
  accession: 'GHGAD588887987',
  title: 'Test dataset for details',
  description:
    'Test dataset for Metadata Repository get dataset details call. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel risus commodo viverra maecenas accumsan lacus vel. Sit amet risus nullam eget felis eget nunc lobortis mattis. Iaculis at erat pellentesque adipiscing commodo. Volutpat consequat mauris nunc congue. At lectus urna duis convallis convallis tellus id interdum velit. Gravida cum sociis natoque penatibus et. Mauris in aliquam sem fringilla ut morbi. Ultrices gravida dictum fusce ut. At consectetur lorem donec massa sapien faucibus et molestie.',
  types: ['Test Type'],
  ega_accession: 'EGAD588887987',
  data_access_policy: {
    name: 'DAP 1',
    data_access_committee: {
      alias: 'Test DAC',
      email: 'test[at]test[dot]de',
    },
    policy_text: `Test policy text. Neque volutpat ac tincidunt vitae semper quis. Mi eget mauris pharetra et ultrices neque ornare. Consectetur purus ut faucibus pulvinar elementum. Tortor at risus viverra adipiscing. Aliquam eleifend mi in nulla. Orci ac auctor augue mauris augue neque gravida. Rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Turpis massa tincidunt dui ut ornare lectus sit amet. Laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt. Auctor eu augue ut lectus arcu bibendum. Aenean et tortor at risus.\n
      Diam phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet. Tempor orci eu lobortis elementum nibh. Tincidunt praesent semper feugiat nibh sed pulvinar proin gravida. Sed nisi lacus sed viverra tellus. Orci dapibus ultrices in iaculis nunc sed augue. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim. Facilisi cras fermentum odio eu. Est placerat in egestas erat. At ultrices mi tempus imperdiet nulla malesuada. Tincidunt arcu non sodales neque. Mi bibendum neque egestas congue quisque.\n
      Pharetra vel turpis nunc eget lorem dolor sed. Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et. Vel pretium lectus quam id leo. Ornare suspendisse sed nisi lacus sed viverra. Magna etiam tempor orci eu lobortis elementum. Aliquam nulla facilisi cras fermentum. Rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi cras. Nam at lectus urna duis. Nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi. At elementum eu facilisis sed odio morbi quis commodo odio. Amet nisl purus in mollis nunc sed id. Tristique sollicitudin nibh sit amet. Arcu risus quis varius quam quisque id diam. Nisl tincidunt eget nullam non. Bibendum arcu vitae elementum curabitur vitae. Vitae aliquet nec ullamcorper sit amet risus nullam eget felis.\n
      Cum sociis natoque penatibus et magnis. Quam lacus suspendisse faucibus interdum. Lorem dolor sed viverra ipsum. Non pulvinar neque laoreet suspendisse interdum consectetur. Sit amet consectetur adipiscing elit ut aliquam. Mi ipsum faucibus vitae aliquet nec. Eget egestas purus viverra accumsan in nisl nisi scelerisque eu. Vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur. Justo nec ultrices dui sapien eget mi proin sed. Lacus viverra vitae congue eu consequat. Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae. Pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Consequat interdum varius sit amet mattis vulputate. Venenatis cras sed felis eget velit. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam. Tristique senectus et netus et malesuada fames ac. Massa enim nec dui nunc mattis enim ut tellus elementum.`,
    policy_url: 'https://test.com',
  },
  study: {
    accession: 'GHGAS21215636',
    ega_accession: 'EGAS21215636',
    types: ['test_genomics'],
    title: 'Test Study',
    description:
      'Test study description. Pharetra convallis posuere morbi leo urna molestie. Ut faucibus pulvinar elementum integer. Nec nam aliquam sem et tortor. Pretium viverra suspendisse potenti nullam ac. Commodo sed egestas egestas fringilla. Tincidunt dui ut ornare lectus sit. Amet massa vitae tortor condimentum lacinia quis vel eros donec. Feugiat pretium nibh ipsum consequat. Pulvinar etiam non quam lacus suspendisse faucibus interdum. Aliquam sem et tortor consequat id.',
    publications: [
      {
        doi: '10.1109/5.771073',
        abstract:
          'Test publication abstract. Varius duis at consectetur lorem donec massa sapien faucibus. Amet porttitor eget dolor morbi non arcu. Urna nec tincidunt praesent semper feugiat nibh sed pulvinar proin. Accumsan tortor posuere ac ut consequat semper viverra nam. Vestibulum lorem sed risus ultricies. Sed odio morbi quis commodo odio. Viverra tellus in hac habitasse. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Faucibus purus in massa tempor nec feugiat nisl. Nibh cras pulvinar mattis nunc. In tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Vitae et leo duis ut diam quam. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Cras pulvinar mattis nunc sed blandit libero volutpat sed cras. Id diam maecenas ultricies mi eget mauris. Pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem. Consequat ac felis donec et.',
        title: 'Test publication',
        author: 'Test author',
        journal: 'Test journal',
        year: 2023,
      },
    ],
  },
  process_data_files: [
    {
      accession: 'GHGASF956121331',
      ega_accession: 'EGAF956121331',
      name: 'Test file 1',
      format: 'FASTQ',
    },
  ],
  experiment_method_supporting_files: [],
  analysis_method_supporting_files: [],
  individual_supporting_files: [],
  research_data_files: [],
  experiments: [
    {
      accession: 'GHGAE588321315',
      ega_accession: 'EGAE588321315',
      title: 'Text Experiment 1',
      description:
        'Test Experiment 1. Sagittis purus sit amet volutpat. Tellus cras adipiscing enim eu turpis egestas pretium. Vitae suscipit tellus mauris a diam maecenas sed enim ut. Vulputate enim nulla aliquet porttitor lacus luctus. Egestas sed sed risus pretium quam vulputate dignissim. Netus et malesuada fames ac turpis egestas maecenas. Nisl condimentum id venenatis a condimentum vitae sapien. Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et. Vitae sapien pellentesque habitant morbi tristique senectus. Leo vel fringilla est ullamcorper eget nulla. Tempus egestas sed sed risus.',
      experiment_method: {
        accession: 'GHGAEM654513213',
        type: 'Experiment Method 1',
        instrument_model: 'Experiment Platform 1',
      },
    },
  ],
  samples: [
    {
      accession: 'GHGASA588321315',
      ega_accession: 'EGASA588321315',
      description:
        'Test Sample 1. Vivamus arcu felis bibendum ut. Eget mi proin sed libero enim. Metus dictum at tempor commodo ullamcorper a lacus. Tincidunt tortor aliquam nulla facilisi cras. Nullam vehicula ipsum a arcu. Malesuada proin libero nunc consequat. Purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Elementum eu facilisis sed odio morbi quis. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant. Purus sit amet volutpat consequat mauris nunc. Ultricies mi quis hendrerit dolor magna eget est lorem. Fermentum leo vel orci porta non pulvinar. Integer malesuada nunc vel risus commodo viverra maecenas.',
      name: 'Test anatomical entity',
      case_control_status: 'Test control status',
      individual: {
        sex: 'Female',
        phenotypic_features_terms: ['Test phenotypic feature 1'],
      },
      biospecimen_type: 'Test biospeciment type 1',
      biospecimen_tissue_term: 'Test tissue',
    },
  ],
};

export const datasetInformation: DatasetInformation = {
  accession: 'GHGAD588887988',
  file_information: [
    {
      accession: 'GHGASF956121331',
      sha256_hash: '58b2e5a09936322db4ab1b921847d0f3b83027e0255cd24d7e58c420845286dc',
      size: 123456789,
      storage_alias: 'TUE01',
    },
  ],
};

/**
 * This component is a Schemapack Playground for validating metadata files.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PyodideService } from '@app/tools/services/pyodide.service';
import { MetadataValidationService } from '@app/tools/services/validator.service';
import { firstValueFrom } from 'rxjs';
import { FormatSchemapackErrorPipe } from '../../pipes/schemapack-error.pipe';

const PLAYGROUND_SCHEMA_PYODIDE_PATH = '/playground/schema.yaml';
const PLAYGROUND_JSON_PYODIDE_PATH = '/playground/data.json';
const PLAYGROUND_SCHEMA_ASSET_PATH = 'assets/schemas/demo_schema.schemapack.yaml';

/**
 * This component uses schemapack to validate metadata files. It serves as a demo for that library.
 */
@Component({
  selector: 'app-schemapack-playground',
  templateUrl: './schemapack-playground.component.html',
  styleUrls: ['./schemapack-playground.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    FormatSchemapackErrorPipe,
  ],
})
export class SchemapackPlaygroundComponent {
  #validationService = inject(MetadataValidationService);
  #pyodideService = inject(PyodideService);
  #http = inject(HttpClient);
  schemaYaml = signal<string>('');
  jsonData = signal<string>('');
  defaultSchema = '';
  statusText = signal<string>('Ready. Load a default or paste your content.');
  isStatusError = signal<boolean>(false);
  showSpinner = signal<boolean>(false);
  validationDetails = signal<string | null>(null);

  /**
   * Loads the default schema and JSON data into the text areas.
   */
  async loadDefault() {
    this.defaultSchema = await firstValueFrom(
      this.#http.get(PLAYGROUND_SCHEMA_ASSET_PATH, { responseType: 'text' }),
    );
    this.schemaYaml.set(this.defaultSchema);
    this.jsonData.set(JSON.stringify({}));
    this.statusText.set('Default example loaded. Ready to validate.');
    this.isStatusError.set(false);
    this.validationDetails.set(null);
  }

  /**
   * This function starts the validation process.
   */
  async validate(): Promise<void> {
    this.showSpinner.set(true);
    this.isStatusError.set(false);
    this.validationDetails.set(null);

    this.#pyodideService.resetProcessLog();
    this.#pyodideService.writeStringToPyodide(
      this.schemaYaml(),
      PLAYGROUND_SCHEMA_PYODIDE_PATH,
    );
    this.#pyodideService.writeStringToPyodide(
      this.jsonData(),
      PLAYGROUND_JSON_PYODIDE_PATH,
    );

    const result = await this.#validationService.runValidator(
      PLAYGROUND_JSON_PYODIDE_PATH,
      PLAYGROUND_SCHEMA_PYODIDE_PATH,
    );

    if (!result.success) {
      this.statusText.set('Validation failed. Check the details below.');
      this.isStatusError.set(true);
      this.validationDetails.set(result.stderr);
    }

    this.showSpinner.set(false);
  }
}

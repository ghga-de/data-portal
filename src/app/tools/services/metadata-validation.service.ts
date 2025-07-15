/**
 * This service provides functionality to validate metadata files
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface PyodideOutput {
  json_output: string | null;
  error_message: string | null;
  success: boolean;
  py_output_file_path: string;
  validation_success?: boolean;
  validation_stdout?: string;
  validation_stderr?: string;
}

export interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'error' | 'debug';
  time: string;
}

const YAML_SCHEMA_PATH = 'assets/schemas/ghga_metadata_schema.resolved.schemapack.yaml';
const PYTHON_SCRIPT_PATH = 'assets/schemas/transpilation_and_validation.py';
const PYODIDE_CDN_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';

/**
 * This service handles the initialization of Pyodide,
 * loading necessary packages, and providing methods to validate metadata files.
 * It uses the `ghga-transpiler` and `schemapack` packages to perform the validation.
 */
@Injectable({
  providedIn: 'root',
})
export class MetadataValidationService {
  #pyodide: any = null;
  #pyodideLoading: WritableSignal<boolean> = signal(false);
  #pyodideInitialized: WritableSignal<boolean> = signal(false);
  #processLog: WritableSignal<LogEntry[]> = signal([]);
  #http = inject(HttpClient);
  #pythonScript = '';

  readonly isPyodideInitialized = this.#pyodideInitialized.asReadonly();
  readonly getProcessLog = this.#processLog.asReadonly();
  readonly isPyodideLoading = this.#pyodideLoading.asReadonly();

  constructor() {
    this.#initPyodide();
  }

  /**
   * Logs a message to the process log.
   * @param message - the log message
   * @param type - the log type (info, success, error, debug)
   */
  public log(
    message: string,
    type: 'info' | 'success' | 'error' | 'debug' = 'info',
  ): void {
    const time = new Date().toLocaleTimeString();
    this.#processLog.update((currentLog) => [...currentLog, { message, type, time }]);
    console.log(`[Log ${type.toUpperCase()}] ${message}`);
  }

  /**
   * This function initializes the Pyodide runtime,
   * loads the necessary packages, and prepares the environment for validation.
   * It also loads a custom YAML schema from the assets folder into the Pyodide filesystem.
   * It should be called once at the start of the application.
   * If Pyodide is already loading or initialized, it will return early.
   * @returns A promise that resolves when Pyodide is fully initialized.
   * @throws Will throw an error if Pyodide fails to initialize or if critical packages fail to load.
   */
  async #initPyodide(): Promise<void> {
    if (this.#pyodideLoading() || this.#pyodideInitialized()) {
      return;
    }

    this.#pyodideLoading.set(true);
    this.log('Loading Pyodide runtime...', 'info');

    try {
      // Load Pyodide from CDN
      const pyodideScript = document.createElement('script');
      pyodideScript.src = PYODIDE_CDN_URL + 'pyodide.js';
      document.head.appendChild(pyodideScript);

      // Wait for script to load
      await new Promise((resolve, reject) => {
        pyodideScript.onload = resolve;
        pyodideScript.onerror = reject;
      });

      // Access loadPyodide from global scope
      const loadPyodide = (window as any).loadPyodide;
      if (!loadPyodide) {
        throw new Error('loadPyodide not found in global scope');
      }

      this.log('Setting Pyodide indexURL to: ' + PYODIDE_CDN_URL, 'debug');

      this.#pyodide = await loadPyodide({
        indexURL: PYODIDE_CDN_URL,
      });
      this.log('Pyodide core loaded.', 'info');

      this.log('Loading micropip & ghga-transpiler...', 'info');
      await this.#pyodide.loadPackage(['micropip']);
      const micropip = this.#pyodide.pyimport('micropip');
      this.log('Micropip loaded.', 'info');

      const packagesToInstall = ['ghga-transpiler', 'schemapack', 'openpyxl', 'typer'];
      this.log(
        'Attempting to install: ' + packagesToInstall.join(', ') + ' ...',
        'info',
      );
      await micropip.install(packagesToInstall, { keep_going: true });
      this.log('Package installation attempt finished.', 'info');

      const yamlString = await firstValueFrom(
        this.#http.get(YAML_SCHEMA_PATH, { responseType: 'text' }),
      );
      this.#pythonScript = await firstValueFrom(
        this.#http.get(PYTHON_SCRIPT_PATH, { responseType: 'text' }),
      );
      const targetPathInPyodide = '/data/metadata_model.yaml';

      const yamlWritten = this.#writeYamlStringToPyodide(
        yamlString,
        targetPathInPyodide,
      );
      if (yamlWritten) {
        this.log(
          'Custom YAML (from asset) loaded successfully into Pyodide.',
          'success',
        );
      } else {
        this.log('Failed to load custom YAML (from asset) into Pyodide.', 'error');
      }

      this.#pyodideInitialized.set(true);
      this.log('ghga-transpiler ready.', 'success');
    } catch (error: any) {
      const errorMsg = error.message || 'Unknown initialization error.';
      this.log(`Initialization Error: ${errorMsg}`, 'error');
      console.error(
        'FATAL: Pyodide initialization or critical package loading error:',
        error,
      );
      this.#pyodideInitialized.set(false);
    } finally {
      this.#pyodideLoading.set(false);
    }
  }

  /**
   * Writes a YAML string to the Pyodide filesystem.
   * @param yamlString - the YAML content to write
   * @param pyodideFsPath - the absolute path in the Pyodide filesystem where to write the file
   * @returns True if successful, false otherwise
   */
  #writeYamlStringToPyodide(yamlString: string, pyodideFsPath: string): boolean {
    try {
      if (!this.#pyodide?.FS) {
        this.log('Pyodide instance or FS is not available.', 'error');
        return false;
      }
      if (typeof yamlString !== 'string') {
        this.log('Provided YAML content is not a string.', 'error');
        return false;
      }
      if (
        !pyodideFsPath ||
        typeof pyodideFsPath !== 'string' ||
        !pyodideFsPath.startsWith('/')
      ) {
        this.log(
          'Invalid Pyodide filesystem path provided. It must be an absolute path string (e.g., "/config/data.yaml").',
          'error',
        );
        return false;
      }

      this.log(
        `Writing YAML string to Pyodide FS at: ${pyodideFsPath}. String length: ${yamlString.length}`,
        'debug',
      );

      const dirname = pyodideFsPath.substring(0, pyodideFsPath.lastIndexOf('/'));
      if (dirname && !this.#pyodide.FS.analyzePath(dirname).exists) {
        this.#pyodide.FS.mkdirTree(dirname);
        this.log(`Created directory ${dirname} in Pyodide FS.`, 'debug');
      }

      this.#pyodide.FS.writeFile(pyodideFsPath, yamlString, { encoding: 'utf8' });
      this.log(
        `YAML string successfully written to Pyodide FS at: ${pyodideFsPath}`,
        'success',
      );
      return true;
    } catch (error: any) {
      console.error(
        `[Service] Error writing YAML string to Pyodide FS at ${pyodideFsPath}:`,
        error,
      );
      this.log(
        `Error writing YAML string to ${pyodideFsPath}: ${error.message}`,
        'error',
      );
      return false;
    }
  }

  /**
   * This function perofrms the actual transpilation of an XLSX file to JSON.
   * It writes the XLSX file to the Pyodide filesystem,
   * executes the `ghga-transpiler` Python script,
   * and returns the JSON output or error details.
   * @param fileBuffer The XLSX file as an ArrayBuffer.
   * @returns A promise that resolves to a PyodideOutput object containing the JSON output, error message, and success status.
   * @throws Will throw an error if Pyodide is not initialized or if the transpilation fails.
   */
  public async transpileXlsxToJsonAndValidate(
    fileBuffer: ArrayBuffer,
  ): Promise<PyodideOutput> {
    if (!this.#pyodideInitialized() || !this.#pyodide) {
      const msg = 'Pyodide not ready.';
      this.log(msg, 'error');
      return {
        json_output: null,
        error_message: msg,
        success: false,
        py_output_file_path: '',
      };
    }

    this.#processLog.set([]);
    this.log('Transpilation process started...', 'info');

    const inputFilePath = '/data/input.xlsx';
    const outputFilePathPy = '/data/output.json';

    try {
      this.log(
        `Preparing to write input file to Pyodide FS: ${inputFilePath}`,
        'debug',
      );
      this.log(`Designated output file (Python side): ${outputFilePathPy}`, 'debug');

      try {
        if (!this.#pyodide.FS.analyzePath('/data').exists) {
          this.#pyodide.FS.mkdir('/data');
          this.log('Created /data directory in Pyodide FS.', 'debug');
        }
      } catch (e: any) {
        this.log(`Error with /data directory: ${e?.message || e}`, 'error');
        throw e;
      }

      this.#pyodide.FS.writeFile(inputFilePath, new Uint8Array(fileBuffer));
      this.log(
        `FS.writeFile completed for ${inputFilePath}. Byte length: ${fileBuffer.byteLength}`,
        'debug',
      );

      const analysis = this.#pyodide.FS.analyzePath(inputFilePath);
      if (!analysis.exists || !analysis.object?.contents) {
        this.log(`${inputFilePath} NOT FOUND or empty after writing!`, 'error');
        throw new Error('File not found in Pyodide FS after writing.');
      }

      const transpilerArgs = [inputFilePath, outputFilePathPy];
      this.#pyodide.globals.set('transpiler_args_js', transpilerArgs);
      this.log('Set transpiler_args_js in Pyodide globals.', 'debug');
      this.log('Executing Python transpiler script...', 'info');
      const transpileResultProxy = await this.#pyodide.runPythonAsync(
        this.#pythonScript,
      );
      const transpileResult = Object.fromEntries(transpileResultProxy.toJs());
      transpileResultProxy.destroy();

      this.log(
        `Python script finished. Success: ${transpileResult['success']}`,
        'debug',
      );

      return transpileResult as PyodideOutput;
    } catch (error: any) {
      console.error(
        '[Service] FATAL: Transpilation Process Error Caught in Service:',
        error,
      );
      let errorMessage = 'An unexpected error occurred during transpilation.';
      if (error?.message) {
        errorMessage = error.message;
        if (error.message.includes('Traceback (most recent call last):')) {
          errorMessage = `A Python error occurred. Check browser console for full traceback. Original message: ${error.message.substring(0, 200)}...`;
        }
      }
      this.log(`Transpilation Failed: ${errorMessage}`, 'error');
      return {
        json_output: null,
        error_message: errorMessage,
        success: false,
        py_output_file_path: '',
      };
    }
  }
}

/**
 * This component acts as a frontend for the validation service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  LogEntry,
  MetadataValidationService,
  PyodideOutput,
} from '../../services/metadata-validation.service';

type StepStatus = 'idle' | 'ongoing' | 'succeeded' | 'failed';
type StepName = 'fileSelection' | 'transpilation' | 'validation';

/**
 * This component works in tandem with the MetadataValidationService to provide
 * a user interface for validating metadata files.
 * It allows users to drag and drop or select XLSX files, which are then
 * processed to JSON format and validated against a schema.
 */
@Component({
  selector: 'app-metadata-validator',
  templateUrl: './metadata-validator.component.html',
  styleUrls: ['./metadata-validator.component.scss'],
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class MetadataValidatorComponent implements OnInit {
  #validationService = inject(MetadataValidationService);
  statusText: WritableSignal<string> = signal('Initializing...');
  isStatusError: WritableSignal<boolean> = signal(false);
  errorText: WritableSignal<string> = signal('');
  showSpinner: WritableSignal<boolean> = signal(true);
  isDragOver: WritableSignal<boolean> = signal(false);
  fileName: WritableSignal<string> = signal('');
  jsonOutput: WritableSignal<string> = signal('Awaiting XLSX file...');
  processLogEntries: WritableSignal<LogEntry[]> = signal([]);
  showLog: WritableSignal<boolean> = signal(false);
  processButtonEnabled: WritableSignal<boolean> = signal(false);

  currentStep: WritableSignal<'idle' | StepName> = signal('idle');
  stepStatus: WritableSignal<{
    fileSelection: StepStatus;
    transpilation: StepStatus;
    validation: StepStatus;
  }> = signal({
    fileSelection: 'idle',
    transpilation: 'idle',
    validation: 'idle',
  });

  validationOutputDetails: WritableSignal<string | null> = signal(null);

  #fileBuffer: ArrayBuffer | null = null;

  constructor() {
    effect(() => {
      const isReady = this.#validationService.isPyodideInitialized();
      const isLoading = this.#validationService.isPyodideLoading();

      if (isLoading) {
        this.#updateStatus('Loading Pyodide runtime...', false, true);
        this.#resetStepStatus();
      } else if (isReady) {
        this.#updateStatus('ghga-transpiler ready.', false, false);
        this.currentStep.set('fileSelection');
        this.processButtonEnabled.set(this.#fileBuffer !== null);
      } else {
        this.#updateStatus('Pyodide initialization failed.', true, false);
        this.processButtonEnabled.set(false);
        this.#setStepStatus('fileSelection', 'failed');
      }
    });

    // React to process log updates from the service
    effect(() => {
      this.processLogEntries.set(this.#validationService.getProcessLog());
      // Scroll to bottom of log if it's visible, ensure this runs after DOM update
      setTimeout(() => {
        const logContainer = document.getElementById('processLog');
        if (logContainer) {
          logContainer.scrollTop = logContainer.scrollHeight;
        }
      }, 0);
    });
  }

  ngOnInit(): void {
    this.jsonOutput.set('Awaiting XLSX file...');
  }

  /**
   * Resets all step statuses to 'idle'.
   */
  #resetStepStatus(): void {
    this.stepStatus.set({
      fileSelection: 'idle',
      transpilation: 'idle',
      validation: 'idle',
    });
    this.currentStep.set('idle');
  }

  /**
   * Sets the status of a specific step.
   * @param step The step to update.
   * @param status The new status.
   */
  #setStepStatus(step: StepName, status: StepStatus): void {
    this.stepStatus.update((current) => ({ ...current, [step]: status }));
  }

  /**
   * Updates the status display in the UI using signals.
   * @param message The status message.
   * @param isError Whether the message indicates an error.
   * @param keepSpinner Whether to keep the spinner visible.
   */
  #updateStatus(message: string, isError: boolean, keepSpinner: boolean): void {
    this.statusText.set(message);
    this.isStatusError.set(isError);
    this.errorText.set(isError ? message : '');
    this.showSpinner.set(keepSpinner);
  }

  /**
   * Handles drag over event for the drop area.
   * @param event DragEvent
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  /**
   * Handles drag leave event for the drop area.
   * @param event DragEvent
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  /**
   * Handles drop event for the drop area.
   * @param event DragEvent
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.#handleFile(files[0]);
    }
  }

  /**
   * Handles file selection via input.
   * @param event Event
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.#handleFile(files[0]);
    }
  }

  /**
   * Processes the selected file.
   * @param file The File object.
   */
  #handleFile(file: File): void {
    this.jsonOutput.set('Awaiting XLSX file...'); // Set initial message for pre tag
    this.validationOutputDetails.set(null); // Clear previous validation errors

    this.currentStep.set('fileSelection');
    this.#setStepStatus('fileSelection', 'ongoing');
    this.#setStepStatus('transpilation', 'idle');
    this.#setStepStatus('validation', 'idle');

    if (!file || !file.name.endsWith('.xlsx')) {
      const msg = 'Please select a valid .xlsx file.';
      this.#updateStatus(msg, true, false);
      this.fileName.set('');
      this.#fileBuffer = null;
      this.processButtonEnabled.set(false);
      this.#setStepStatus('fileSelection', 'failed');
      return;
    }

    this.fileName.set(`Selected: ${file.name}`);
    const reader = new FileReader();

    reader.onload = (e) => {
      this.#fileBuffer = e.target?.result as ArrayBuffer;
      const msg = `File "${file.name}" loaded. Ready to transpile.`;
      this.#updateStatus(msg, false, false);
      this.#setStepStatus('fileSelection', 'succeeded');
      // Enable button only if Pyodide is initialized and a file is loaded
      this.processButtonEnabled.set(this.#validationService.isPyodideInitialized());
      this.jsonOutput.set('Ready for transpilation...'); // Update pre tag
    };

    reader.onerror = (e) => {
      const msg = `Error reading file: ${e.target?.error?.name}`;
      this.#updateStatus(msg, true, false);
      this.#fileBuffer = null;
      this.processButtonEnabled.set(false);
      this.#setStepStatus('fileSelection', 'failed');
    };

    reader.readAsArrayBuffer(file);
  }

  /**
   * Initiates the transpilation process.
   */
  async transpileFile(): Promise<void> {
    if (!this.#fileBuffer) {
      const msg = 'No file selected to transpile.';
      this.#updateStatus(msg, true, false);
      this.#setStepStatus('transpilation', 'failed');
      return;
    }

    this.#updateStatus('Transpiling XLSX to JSON...', false, true);
    this.processButtonEnabled.set(false);
    this.jsonOutput.set('Processing...'); // Update pre tag
    this.validationOutputDetails.set(null); // Clear validation output when starting a new transpile

    this.currentStep.set('transpilation');
    this.#setStepStatus('transpilation', 'ongoing');
    this.#setStepStatus('validation', 'idle'); // Reset validation step

    try {
      const result: PyodideOutput =
        await this.#validationService.transpileXlsxToJsonAndValidate(this.#fileBuffer);

      if (result.success && result.json_output !== null) {
        this.jsonOutput.set(result.json_output);

        this.#setStepStatus('transpilation', 'succeeded');
        this.currentStep.set('validation');
        this.#setStepStatus('validation', 'ongoing');

        if (result.validation_success !== undefined) {
          if (result.validation_success) {
            this.#validationService['appendToProcessLog'](
              'Schema validation successful!',
              'success',
            );
            this.#setStepStatus('validation', 'succeeded');
            this.#updateStatus(
              'Transpilation and validation successful!',
              false,
              false,
            );

            if (result.validation_stdout && result.validation_stdout.trim()) {
              this.#validationService['appendToProcessLog'](
                `Validation Output (stdout):\n${result.validation_stdout.trim()}`,
                'info',
              );
            }

            if (result.validation_stderr && result.validation_stderr.trim()) {
              this.#validationService['appendToProcessLog'](
                `Validation Info/Warnings (stderr):\n${result.validation_stderr.trim()}`,
                'info',
              );
              this.validationOutputDetails.set(
                this.#formatSchemapackError(result.validation_stderr.trim()),
              );
            }
          } else {
            this.#setStepStatus('validation', 'failed');
            this.#validationService['appendToProcessLog'](
              'Schema validation FAILED.',
              'error',
            );
            this.#updateStatus(
              'Transpilation successful, but validation failed.',
              true,
              false,
            );

            let combinedValidationError = '';
            if (result.validation_stdout && result.validation_stdout.trim()) {
              combinedValidationError += `Validation Output (stdout):\n${result.validation_stdout.trim()}\n\n`;
              this.#validationService['appendToProcessLog'](
                `Validation Output (stdout):\n${result.validation_stdout.trim()}`,
                'info',
              );
            }
            if (result.validation_stderr && result.validation_stderr.trim()) {
              combinedValidationError += `Validation Errors (stderr):\n${result.validation_stderr.trim()}`;
              this.#validationService['appendToProcessLog'](
                `Validation Errors (stderr):\n${result.validation_stderr.trim()}`,
                'error',
              );
            } else {
              combinedValidationError +=
                'No specific error message from validation. Check console.';
              this.#validationService['appendToProcessLog'](
                'No specific error message from validation. Check console.',
                'error',
              );
            }
            this.validationOutputDetails.set(
              this.#formatSchemapackError(combinedValidationError.trim()),
            );
          }
        } else {
          this.#validationService['appendToProcessLog'](
            'Validation was not performed (likely due to prior transpilation issues).',
            'info',
          );
          this.#setStepStatus('validation', 'idle');
          this.#updateStatus(
            'Transpilation successful, validation skipped.',
            false,
            false,
          );
        }
      } else {
        const errorMsg =
          result.error_message || 'Unknown transpilation error or no JSON output.';
        this.jsonOutput.set(`Transpilation Failed. See process log.`);
        this.#updateStatus(
          'Transpilation failed. Check process log and console.',
          true,
          false,
        );
        this.#setStepStatus('transpilation', 'failed');
        this.#setStepStatus('validation', 'failed');
        this.validationOutputDetails.set(null);
      }
    } catch (error: any) {
      const errorMsg =
        error.message || 'An unexpected error occurred during transpilation.';
      this.jsonOutput.set(`Transpilation Error: ${errorMsg}`);
      this.#updateStatus(`Transpilation Error. ${errorMsg}`, true, false);
      this.#setStepStatus('transpilation', 'failed');
      this.#setStepStatus('validation', 'failed');
      this.validationOutputDetails.set(null);
    } finally {
      this.processButtonEnabled.set(true);
    }
  }

  /**
   * Initiates download of the current JSON output.
   */
  downloadJson(): void {
    const jsonContent = this.jsonOutput();
    if (
      !jsonContent ||
      jsonContent === 'Awaiting XLSX file...' ||
      jsonContent === 'Processing...' ||
      jsonContent.startsWith('Transpilation ')
    ) {
      return;
    }

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Formats the schemapack error string to remove box-drawing characters
   * and replace them with standard characters for better display in a pre tag.
   * @param errorString The raw error string from schemapack.
   * @returns The formatted error string.
   */
  #formatSchemapackError(errorString: string): string {
    // Remove specific box-drawing characters and replace with spaces or empty string
    let formattedError = errorString.replace(/[╭─╮│╰╯]/g, (match) => {
      switch (match) {
        case '╭':
          return ''; // Remove top-left corner
        case '─':
          return ''; // Replace horizontal lines with empty string (will let content wrap naturally)
        case '╮':
          return ''; // Remove top-right corner
        case '│':
          return '  '; // Replace vertical line with two spaces for indentation
        case '╰':
          return ''; // Remove bottom-left corner
        case '╯':
          return ''; // Remove bottom-right corner
        default:
          return match; // Keep other characters as is
      }
    });

    formattedError = formattedError
      .split('\n')
      .filter((line) => line.trim() !== '')
      .join('\n');

    formattedError = formattedError
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');

    formattedError = formattedError
      .split('\n')
      .map((line) => {
        return line.replace(/^ {2,}/, '  ');
      })
      .join('\n');

    return formattedError.trim();
  }

  /**
   * Toggles the visibility of the process log.
   */
  toggleLog(): void {
    this.showLog.update((currentValue) => !currentValue);
  }
}

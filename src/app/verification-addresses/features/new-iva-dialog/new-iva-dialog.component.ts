/**
 * Dialog to enter the details of a new IVA
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { Component, ElementRef, inject, viewChild } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IvaType } from '@app/verification-addresses/models/iva';
import { IvaTypePipe } from '@app/verification-addresses/pipes/iva-type.pipe';

/**
 * IVA creation dialog component
 */
@Component({
  selector: 'app-new-iva-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonToggleModule,
  ],
  templateUrl: './new-iva-dialog.component.html',
})
export class NewIvaDialogComponent {
  #dialogRef = inject(
    MatDialogRef<NewIvaDialogComponent, { type: IvaType; value: string }>,
  );

  /**
   * Value prompts for the different IVA types
   */
  valuePrompts: { [key in keyof typeof IvaType]: string } = {
    Phone: 'Please enter your phone number to receive an SMS:',
    Fax: '', // do not show this option
    PostalAddress: 'Please enter your postal address:',
    InPerson: 'Please enter a meeting location:',
  };

  /**
   * All possible IVA types
   */
  types = Object.entries(IvaType)
    .filter((entry) => this.valuePrompts[entry[0] as keyof typeof IvaType])
    .map((entry) => ({
      value: entry[0] as keyof typeof IvaType,
      text: new IvaTypePipe().transform(entry[1]).display,
    }));

  valueField = viewChild('valueField', { read: ElementRef });

  /**
   * The selected IVA type
   */
  type: keyof typeof IvaType | undefined = undefined;

  /**
   * The IVA value entered by the user
   */
  value: string = '';

  /**
   * Get the value prompt for the selected IVA type
   * @returns the text to be shown as prompt for the value input
   */
  get valuePrompt(): string {
    return this.type ? this.valuePrompts[this.type] : '';
  }

  /**
   * Focus the value field when the type was changed
   */
  onTypeChange(): void {
    setTimeout(() => this.valueField()?.nativeElement.focus(), 5);
  }

  /**
   * On input, modify the code to uppercase
   */
  onInput(): void {}

  /**
   * Cancel the dialog
   */
  onCancel(): void {
    this.#dialogRef.close(undefined);
  }

  /**
   * Complete the verification and pass the entered IVA data
   */
  onSubmit(): void {
    if (this.type && this.value) {
      this.#dialogRef.close({ type: IvaType[this.type], value: this.value });
    }
  }
}

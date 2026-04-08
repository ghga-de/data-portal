/**
 * Dialog to enter the details of a new IVA
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { A11yModule } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { IvaType } from '@app/ivas/models/iva';
import { IvaTypePipe } from '@app/ivas/pipes/iva-type-pipe';
import { NgxMatInputTelComponent } from 'ngx-mat-input-tel';

/**
 * IVA creation dialog component
 *
 * This component uses the international telephone input for Angular Material
 * provided by [ngxMatInputTel](https://github.com/rbalet/ngx-mat-input-tel).
 * The full validation of the phone numbers is done on the server side.
 */
@Component({
  selector: 'app-new-iva-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonToggleModule,
    NgxMatInputTelComponent,
    A11yModule,
  ],
  providers: [IvaTypePipe],
  templateUrl: './new-iva-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewIvaDialogComponent {
  #dialogRef = inject(
    MatDialogRef<NewIvaDialogComponent, { type: IvaType; value: string }>,
  );
  #ivaTypePipe = inject(IvaTypePipe);

  type = signal<keyof typeof IvaType | null>(null);
  value = signal<string>('');

  /**
   * Signal indicating whether the form is invalid
   * @returns true if the form is invalid, false otherwise
   */
  isInvalid = computed(() => !this.type() || !this.value()?.trim());

  /**
   * Value prompts for the different IVA types
   */
  valuePrompts: { [key in keyof typeof IvaType]: string } = {
    Phone: 'Please enter your phone number to receive an SMS:',
    InPerson: 'Please enter a meeting location:',
    // the following options should not be selectable any more:
    Fax: '',
    PostalAddress: '',
  };

  /**
   * Get the display name for an IVA type
   * @param type the IVA type in question
   * @returns the display name
   */
  #ivaTypeName(type: IvaType): string {
    return this.#ivaTypePipe.transform(type).name;
  }

  /**
   * All possible IVA types
   */
  types = Object.entries(IvaType)
    .filter((entry) => this.valuePrompts[entry[0] as keyof typeof IvaType])
    .map((entry) => ({
      value: entry[0] as keyof typeof IvaType,
      text: this.#ivaTypeName(entry[1]),
    }));

  valueField = viewChild('valueField', { read: ElementRef });

  /**
   * Get the value prompt for the selected IVA type
   * @returns the text to be shown as prompt for the value input
   */
  get valuePrompt(): string {
    return this.type() ? this.valuePrompts[this.type()!] : '';
  }

  /**
   * Update the selected type, reset the value, and focus the value field
   * @param newType the newly selected IVA type
   */
  onTypeChange(newType: keyof typeof IvaType): void {
    this.type.set(newType);
    this.value.set('');
    setTimeout(
      () =>
        this.valueField()
          ?.nativeElement?.closest('mat-form-field')
          ?.querySelector('input')
          ?.focus(),
      5,
    );
  }

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
    const type = this.type();
    const value = this.value()?.trim();
    if (type && value) {
      this.#dialogRef.close({ type: IvaType[type], value });
    }
  }
}

/**
 * Component that lists the current user's open research data upload boxes.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@app/auth/services/auth';
import { Iva, IvaState } from '@app/ivas/models/iva';
import { IvaTypePipe } from '@app/ivas/pipes/iva-type-pipe';
import { IvaService } from '@app/ivas/services/iva';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NotificationService } from '@app/shared/services/notification';
import { StencilComponent } from '@app/shared/ui/stencil/stencil/stencil';
import { UploadBoxState } from '@app/upload/models/box';
import { GrantWithBoxInfo } from '@app/upload/models/grant';
import { UploadBoxService } from '@app/upload/services/upload-box';

/** An upload grant enriched with its matched IVA record (if any). */
type OpenGrantWithIva = GrantWithBoxInfo & { iva: Iva | undefined };

/**
 * Shows the current user's open research data upload boxes (RDUBs).
 * For each open box the user can create an upload token (placeholder) or submit the box.
 */
@Component({
  selector: 'app-user-upload-grants-list',
  imports: [StencilComponent, MatIconModule, MatButtonModule, IvaTypePipe],
  templateUrl: './user-upload-grants-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserUploadGrantsListComponent implements OnInit {
  readonly ivaState = IvaState;

  #uploadBoxService = inject(UploadBoxService);
  #ivaService = inject(IvaService);
  #auth = inject(AuthService);
  #confirmation = inject(ConfirmationService);
  #notification = inject(NotificationService);

  protected isLoading = computed(
    () =>
      this.#uploadBoxService.userGrants.isLoading() ||
      this.#ivaService.userIvas.isLoading(),
  );

  protected hasError = computed(() => !!this.#uploadBoxService.userGrants.error());

  #userIvas = computed<Iva[]>(() =>
    this.#ivaService.userIvas.error() ? [] : this.#ivaService.userIvas.value(),
  );

  /** Open upload grants enriched with their associated IVA. */
  protected openGrants = computed<OpenGrantWithIva[]>(() =>
    this.#uploadBoxService.userGrants
      .value()
      .filter((grant) => grant.box_state === UploadBoxState.open)
      .map((grant) => ({
        ...grant,
        iva: this.#userIvas().find((iva) => iva.id === grant.iva_id),
      })),
  );

  /** ID of the box currently being submitted, to disable the button while in flight. */
  protected submittingBoxId = signal<string | null>(null);

  /** Load the current user's IVAs on init; grants load reactively from auth state. */
  ngOnInit(): void {
    const userId = this.#auth.user()?.id;
    this.#ivaService.loadUserIvas(userId);
  }

  /**
   * Placeholder handler for the "Create token" button.
   * Token creation will be implemented in a follow-up PR.
   */
  createToken(): void {
    this.#notification.showInfo('Upload token creation is not yet implemented.');
  }

  /**
   * Ask for confirmation and, on approval, submit the upload box (set state to locked).
   * @param grant - the grant whose upload box should be submitted
   */
  submitBox(grant: OpenGrantWithIva): void {
    this.#confirmation.confirm({
      title: 'Submit upload box?',
      message:
        'Submitting closes the upload box. ' +
        'This action can only be reversed by a data steward. ' +
        'Are you sure you want to proceed?',
      confirmText: 'Submit',
      callback: (confirmed) => {
        if (!confirmed) return;
        this.submittingBoxId.set(grant.box_id);
        this.#uploadBoxService
          .updateUploadBox(grant.box_id, {
            version: grant.box_version,
            state: UploadBoxState.locked,
          })
          .subscribe({
            next: () => {
              this.submittingBoxId.set(null);
              this.#notification.showSuccess(
                'The upload box has been submitted successfully.',
              );
              this.#uploadBoxService.userGrants.reload();
            },
            error: () => {
              this.submittingBoxId.set(null);
              this.#notification.showError(
                'Failed to submit the upload box. Please try again.',
              );
            },
          });
      },
    });
  }
}

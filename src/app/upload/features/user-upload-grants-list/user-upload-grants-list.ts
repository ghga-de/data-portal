/**
 * Component that lists the current user's open Research Data Upload Boxes.
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Iva } from '@app/ivas/models/iva';
import { IvaService } from '@app/ivas/services/iva';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { NotificationService } from '@app/shared/services/notification';
import { StencilComponent } from '@app/shared/ui/stencil/stencil/stencil';
import { UploadBoxState } from '@app/upload/models/box';
import { GrantWithBoxInfo } from '@app/upload/models/grant';
import { UploadBoxService } from '@app/upload/services/upload-box';
// eslint-disable-next-line boundaries/dependencies
import { UploadWorkPackageDialogComponent } from '@app/work-packages/features/upload-work-package-dialog/upload-work-package-dialog';

/**
 * Shows the current user's open Research Data Upload Boxes (RDUBs).
 * For each open box the user can create an upload token (placeholder) or submit the box.
 */
@Component({
  selector: 'app-user-upload-grants-list',
  imports: [StencilComponent, MatIconModule, MatButtonModule],
  templateUrl: './user-upload-grants-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserUploadGrantsListComponent {
  #uploadBoxService = inject(UploadBoxService);
  #iva = inject(IvaService);
  #confirmation = inject(ConfirmationService);
  #dialog = inject(MatDialog);
  #notification = inject(NotificationService);

  protected isLoading = this.#uploadBoxService.userGrants.isLoading;
  protected hasError = this.#uploadBoxService.userGrants.error;
  #userIvas = computed<Iva[]>(() =>
    this.#iva.userIvas.error() ? [] : this.#iva.userIvas.value(),
  );

  /** Open upload grants filtered by state and deduplicated by upload box ID. */
  protected openGrants = computed(() => {
    const openGrants = this.#uploadBoxService.userGrants
      .value()
      .filter((grant) => grant.box_state === UploadBoxState.open);

    const uniqueByBoxId = new Map<string, GrantWithBoxInfo>();
    for (const grant of openGrants) {
      if (!uniqueByBoxId.has(grant.box_id)) {
        uniqueByBoxId.set(grant.box_id, grant);
      }
    }

    return Array.from(uniqueByBoxId.values());
  });

  /** ID of the box currently being submitted, to disable the button while in flight. */
  protected submittingBoxId = signal<string | null>(null);

  /** Track whether loading user IVAs has been triggered for this component instance. */
  #userIvasLoaded = signal(false);

  /**
   * Load user IVAs once, and only when there are open grants that may need IVA details.
   */
  #loadUserIvasWhenNeeded = effect(() => {
    if (this.#userIvasLoaded() || this.hasError() || this.openGrants().length === 0) {
      return;
    }
    this.#iva.loadUserIvas();
    this.#userIvasLoaded.set(true);
  });

  /**
   * Open the upload token creation dialog for a selected upload grant.
   * @param grant - the upload grant with box information
   */
  createToken(grant: GrantWithBoxInfo): void {
    const iva =
      !grant.iva_id || this.#iva.userIvas.error()
        ? undefined
        : this.#userIvas().find((i) => i.id === grant.iva_id);

    this.#dialog.open(UploadWorkPackageDialogComponent, {
      data: { ...grant, iva },
      width: '64rem',
      maxWidth: '96vw',
    });
  }

  /**
   * Ask for confirmation and, on approval, submit the upload box (set state to locked).
   * @param grant - the grant whose upload box should be submitted
   */
  submitBox(grant: GrantWithBoxInfo): void {
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

/**
 * Common canDeactivate guard for all auth pages
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '@app/shared/ui/confirm-dialog/confirm-dialog.component';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * A common canDeactivate guard for all pages that are part of the auth flow
 * @returns true if it is ok to leave the page
 */
export const canDeactivate = (): boolean | Observable<boolean> => {
  const authService = inject(AuthService);

  if (authService.isLoggedOut()) return true;

  const dialog = inject(MatDialog);

  const dialogRef = dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
    ConfirmDialogComponent,
    {
      data: {
        title: 'Login incomplete',
        message: 'You should complete the login process before leaving this page.',
        cancelText: 'Logout',
        confirmText: 'Continue',
      },
    },
  );

  return dialogRef.afterClosed().pipe(
    switchMap(async (result) => {
      if (result === false) {
        await authService.logout();
        return true;
      }
      return false;
    }),
  ) as Observable<boolean>;
};

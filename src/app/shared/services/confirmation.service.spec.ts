/**
 * Tests for shared confirmation dialog service
 * @copyright The GHGA Authors
 * @license Apache-2.0
 */

import { TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '../ui/confirm-dialog/confirm-dialog.component';
import { ConfirmationService } from './confirmation.service';

describe('ConfirmationService', () => {
  let service: ConfirmationService;
  const matDialogMock = {
    open: jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(of(true)),
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmationService, { provide: MatDialog, useValue: matDialogMock }],
    });
    service = TestBed.inject(ConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open the dialog', () => {
    const data = {
      title: 'Test Title',
      message: 'Test Message',
      cancelText: 'Cancel',
      confirmText: 'Confirm',
    };
    service.confirm({
      ...data,
    });

    expect(matDialogMock.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data,
    });
  });

  it('should open the dialog and allow for HTML tags but not render any script embedded in the message', () => {
    const data = {
      title: 'Test Title',
      message:
        '<strong>Test Message.</strong><script>alert("Security risk")</script> Hello World',
      cancelText: 'Cancel',
      confirmText: 'Confirm',
    };
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    service.confirm({
      ...data,
    });

    expect(matDialogMock.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data,
    });
    expect(alertMock).toHaveBeenCalledTimes(0);

    global.alert('test');
    expect(alertMock).toHaveBeenCalledTimes(1);
  });

  it('should call afterClosed and callback with the correct value', (done) => {
    const callbackMock = jest.fn();

    service.confirm({
      message: 'Test Message',
      callback: callbackMock,
    });

    expect(matDialogMock.open).toHaveBeenCalled();
    expect(matDialogMock.open().afterClosed).toHaveBeenCalled();

    matDialogMock
      .open()
      .afterClosed()
      .subscribe(() => {
        expect(callbackMock).toHaveBeenCalledWith(true);
        done();
      });
  });
});

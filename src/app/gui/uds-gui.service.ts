import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators';

import { ModalComponent, DialogType } from './modal/modal.component';
import { CredentialsModalComponent } from './credentials-modal/credentials-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, firstValueFrom } from 'rxjs';

export const toPromise = <T>(observable: Observable<T>|Promise<T>, wait?: number): Promise<T> => {
  if (observable instanceof Promise) {
    return observable;
  }
  if (wait) {
    return firstValueFrom(observable.pipe(timeout(wait)));
  }
  return firstValueFrom(observable);
};

@Injectable()
export class UDSGuiService {
  constructor(public dialog: MatDialog) {}

  async alert(
    title: string,
    message: string,
    autoclose = 0,
  ): Promise<MatDialogRef<ModalComponent>> {
    const width = window.innerWidth < 800 ? '80%' : '40%';
    const dialogRef = this.dialog.open(ModalComponent, {
      width,
      data: {
        title,
        body: message,
        autoclose,
        type: DialogType.alert,
      },
      disableClose: true,
    });
    return dialogRef;
  }

  yesno(title: string, message: string): Promise<boolean> {
    const width = window.innerWidth < 800 ? '80%' : '40%';
    const dialogRef = this.dialog.open(ModalComponent, {
      width,
      data: { title, body: message, type: DialogType.yesno },
      disableClose: true,
    });

    return dialogRef.componentInstance.yesno;
  }

  askCredentials(username: string, domain: string): Promise<{username: string; password: string; domain: string; success: boolean}> {
    const dialogRef = this.dialog.open(CredentialsModalComponent, {
      data: {
        username,
        domain,
      },
    });
    return toPromise(dialogRef.afterClosed());
  }
}

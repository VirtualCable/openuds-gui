import { Injectable } from '@angular/core';

import { ModalComponent, DialogType } from './modal/modal.component';
import { CredentialsModalComponent } from './credentials-modal/credentials-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, firstValueFrom } from 'rxjs';

const toPromise = <T>(observable: Observable<T>): Promise<T> => firstValueFrom(observable);

@Injectable()
export class UDSGuiService {
  constructor(public dialog: MatDialog) {}

  alert(
    title: string,
    message: string,
    autoclose = 0,
    checkClose: Promise<boolean> = null
  ) {
    const width = window.innerWidth < 800 ? '80%' : '40%';
    const dialogRef = this.dialog.open(ModalComponent, {
      width,
      data: {
        title,
        body: message,
        autoclose,
        checkClose,
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

  askCredentials(username: string, domain: string): Promise<{username: string; password: string; domain: string}> {
    const dialogRef = this.dialog.open(CredentialsModalComponent, {
      data: {
        username,
        domain,
      },
    });
    return toPromise(dialogRef.afterClosed());
  }
}

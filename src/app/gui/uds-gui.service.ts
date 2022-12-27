import { Injectable } from '@angular/core';

import { ModalComponent, DialogType } from './modal/modal.component';
import { CredentialsModalComponent } from './credentials-modal/credentials-modal.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';

@Injectable()
export class UDSGuiService {
  constructor(public dialog: MatDialog) {}

  alert(
    title: string,
    message: string,
    autoclose = 0,
    checkClose: Observable<boolean> = null
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

  yesno(title: string, message: string) {
    const width = window.innerWidth < 800 ? '80%' : '40%';
    const dialogRef = this.dialog.open(ModalComponent, {
      width,
      data: { title, body: message, type: DialogType.yesno },
      disableClose: true,
    });

    return dialogRef.componentInstance.yesno;
  }

  askCredentials(username: string, domain: string): Observable<{username: string; password: string; domain: string}> {
    const dialogRef = this.dialog.open(CredentialsModalComponent, {
      data: {
        username,
        domain,
      },
    });
    return dialogRef.afterClosed();
  }
}

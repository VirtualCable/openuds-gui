import { Injectable } from '@angular/core';

import { ModalComponent, DialogType } from './modal/modal.component';
import { MatDialog } from '@angular/material';

@Injectable()
export class UDSGuiService {

  constructor(public dialog: MatDialog) { }

  alert(title: string, message: string, autoclose = 0 ) {
    const width = window.innerWidth < 800 ? '80%' : '40%';
    const dialogRef = this.dialog.open(ModalComponent, {
      width: width,
      data: { title: title, body: message, autoclose: autoclose, type: DialogType.alert },
      disableClose: true,
    });
  }

  yesno(title: string, message: string) {
    const width = window.innerWidth < 800 ? '80%' : '40%';
    const dialogRef = this.dialog.open(ModalComponent, {
      width: width,
      data: { title: title, body: message, type: DialogType.yesno },
      disableClose: true,
    });

    return dialogRef.componentInstance.yesno;
  }
}

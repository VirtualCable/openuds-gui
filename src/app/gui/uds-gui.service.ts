import { Injectable } from '@angular/core';

import { ModalComponent, ModalData } from './modal/modal.component';
import { MatDialog } from '@angular/material';

@Injectable()
export class UDSGuiService {

  constructor(public dialog: MatDialog) { }

  alert(title: string, message: string, autoclose = 0 ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '25%',
      data: { title: title, body: message, autoclose: autoclose },
      disableClose: true,
    });
  }
}

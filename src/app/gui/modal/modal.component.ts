/* eslint-disable no-shadow */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { Future } from '../../helpers/tools';

export enum DialogType {
  alert = 0,
  yesno = 1,
  credentials = 2,
}

export interface ModalData {
  title: string;
  body: string;
  autoclose?: number;
  type: DialogType;
  username?: string;
  domain?: string;
}

@Component({
    selector: 'uds-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    standalone: false
})
export class ModalComponent implements OnInit {
  extra = '';
  yesno: Future<boolean> = new Future<boolean>();

  constructor(public dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    // Notifies on case of yes or not to subscriber
  }

  resolveAndClose(value: boolean): void {
    this.yesno.resolve(value);
    this.close();
  }
  
  close() {
    this.dialogRef.close();
  }

  /**
   * Sets extra information on close button
   *
   * @param miliseconds miliseconds to inform (will be converted to seconds)
   */
  setExtra(miliseconds: number) {
    this.extra = ' (' + Math.floor(miliseconds / 1000) + ' ' + django.gettext('seconds') + ') ';
  }

  async initAlert() {
    const autoclose = this.data.autoclose || 0;
    if (autoclose > 0) {
      this.dialogRef.afterClosed().subscribe((res) => {
        this.close();
      });
      this.setExtra(autoclose);
      interval(1000).subscribe((n) => {
        const rem = autoclose - (n + 1) * 1000;
        this.setExtra(rem);
        if (rem <= 0) {
          this.close();
        }
      });
    }
  }

  ngOnInit() {
    if (this.data.type === DialogType.alert) {
      this.initAlert();
    }
  }
}

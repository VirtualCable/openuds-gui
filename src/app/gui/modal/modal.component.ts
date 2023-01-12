/* eslint-disable no-shadow */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval, Subscription, Observable } from 'rxjs';

declare const django: any;

export enum DialogType {
  alert = 0,
  yesno = 1,
  credentials = 2,
}

export interface ModalData {
  title: string;
  body: string;
  autoclose?: number;
  checkClose?: Promise<boolean>;
  type: DialogType;
  username?: string;
  domain?: string;
}

@Component({
  selector: 'uds-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  extra: string;
  subscription: Subscription;
  yesno: Promise<boolean>;
  resolver: (value: boolean) => void;

  constructor(public dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    // Notifies on case of yes or not to subscriber
    this.yesno = new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
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

  async initAlert(): Promise<void> {
    if (this.data.autoclose > 0) {
      this.dialogRef.afterClosed().subscribe(res => {
        this.close();
      });
      this.setExtra(this.data.autoclose);
      interval(1000).subscribe(n => {
        const rem = this.data.autoclose - (n + 1) * 1000;
        this.setExtra(rem);
        if (rem <= 0) {
          this.close();
        }
      });
      /*window.setTimeout(() => {
        this.dialogRef.close();
      }, this.data.autoclose);*/
    } else if (this.data.checkClose) {
      await this.data.checkClose;
      this.close();
    }
  }

  ngOnInit() {
    if ( this.data.type === DialogType.yesno ) {
      ;
    } else {
      this.initAlert();
    }
  }

}

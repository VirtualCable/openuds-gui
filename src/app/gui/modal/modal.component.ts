import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval, Subscription, Observable } from 'rxjs';

declare var django: any;

export enum DialogType {
  alert = 0,
  yesno = 1
}

export interface ModalData {
  title: string;
  body: string;
  autoclose?: number;
  type: DialogType;
}

@Component({
  selector: 'uds-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  extra: string;
  subscription: Subscription;
  yesno: Observable<boolean>;
  yes: () => void;
  no: () => void;
  close: () => void;

  constructor(public dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    this.subscription = null;
    this.resetCallbacks();
    // Notifies on case of yes or not to subscriber
    this.yesno = new Observable<boolean>((observer) => {
      this.yes = () => {
        observer.next(true);
        observer.complete();
      };
      this.no = () => {
        observer.next(false);
        observer.complete();
      };
      this.close = () => {
        this.doClose();
        observer.next(false);
        observer.complete();
      };
      const self = this;
      return {unsubscribe() {
        self.resetCallbacks();
      }};
    });

  }

  resetCallbacks() {
    this.yes = this.no = () => { this.close(); };
    this.close = () => { this.doClose(); };
  }

  /**
   * Invoked on closed modal component
   * This ensures that we stop subscription to interval
   */
  closed(): void {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }

  doClose(): void {
    this.dialogRef.close();
  }

  /**
   * Sets extra information on close button
   * @param miliseconds miliseconds to inform (will be converted to seconds)
   */
  setExtra(miliseconds: number) {
    this.extra = ' (' + Math.floor(miliseconds / 1000) + ' ' + django.gettext('seconds') + ') ';
  }

  initAlert() {
    if (this.data.autoclose > 0) {
      this.dialogRef.afterClosed().subscribe(res => {
        this.closed();
      });
      this.setExtra(this.data.autoclose);
      this.subscription = interval(1000).subscribe(n => {
        const rem = this.data.autoclose - (n + 1) * 1000;
        this.setExtra(rem);
        if (rem <= 0) {
          this.close();
        }
      });
      /*window.setTimeout(() => {
        this.dialogRef.close();
      }, this.data.autoclose);*/
    }
  }

  initYesNo() {
    // data.autoclose is not used
  }

  ngOnInit() {
    if ( this.data.type === DialogType.yesno ) {
      this.initYesNo();
    } else {
      this.initAlert();
    }
  }

}

import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { interval, Observable, Subscription } from 'rxjs';

export interface ModalData {
  title: string;
  body: string;
  autoclose: number;
}

@Component({
  selector: 'uds-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  extra: string;
  subscription: Subscription;

  constructor(public dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ModalData) {
    this.subscription = null;
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

  close(): void {
    this.dialogRef.close();
  }

  /**
   * Sets extra information on close button
   * @param miliseconds miliseconds to inform (will be converted to seconds)
   */
  setExtra(miliseconds: number) {
    this.extra = ' (' + Math.floor(miliseconds / 1000) + ' ' + django.gettext('seconds') + ') ';
  }

  ngOnInit() {
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

}
